import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CardSummary } from '../card-summary/entities/card-summary.entity';
import { FindOneUserDto } from './dto/findOne-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CardSummary)
    private cardSummaryRepository: Repository<CardSummary>
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> { //for authentication
    return this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
      const user = this.userRepository.create({
        name: createUserDto.name,
        username: createUserDto.username,
        password: createUserDto.password,
        userType: createUserDto.userType,
        dmlStatus: 1}) // Set dml_status to 1 for insert});
      
      const userExist = await this.userRepository.find({
        where :{
          username: createUserDto?.username,
          dmlStatus:Not(2),
        }
      })
      if(userExist.length > 0){
          throw new BadRequestException('Username already exists');
      }
      return this.userRepository.save(user);
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        userId: updateUserDto?.userId,
        dmlStatus:Not(2),
      },
    });

    const userExist = await this.userRepository.find({
      where :{
        username: updateUserDto?.username,
        dmlStatus:Not(2),
      }
    })
    if(userExist.length > 0){
        throw new BadRequestException('Username already exists');
    }
      
    if (user) {
      const res = await this.userRepository.save({
        ...updateUserDto,
        dmlStatus: 3, //dml_Status to 3 for update
      });
      return await this.userRepository.find({
        where: { userId: res?.userId },
      });
      } else {
        throw new NotFoundException(`User with ID ${updateUserDto.userId} not found or has been deleted`);
      }
    }


  async findAll(findAllUserDto:FindAllUserDto): Promise<{ data: User[], count: number }> {
    const page = findAllUserDto.page;
    const limit = findAllUserDto.limit;
    const { name, username, userType } = findAllUserDto;
    const offset = (page - 1) * limit;
    const [data, count] = await this.userRepository.findAndCount({
      where: { dmlStatus: Not(2),
        ...(name && { name: Like(`%${name}%`) }),
        ...(username && { username: Like(`%${username}%`) }),
        ...(userType && { userType }),
       },
      skip: offset,
      take: limit,
    });
    if(data.length <= 0){
      throw new NotFoundException('No records found.');
    }
    return { data, count };
  }

  async findOne(params: FindOneUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where : {userId: params?.userId}   
    });
    if (!user || user.dmlStatus === 2) {
      throw new NotFoundException(`User with ID ${params.userId} not found or has been deleted`);
    }
    return user;
  }

  async remove(params: FindOneUserDto) {
    const res = await this.userRepository.findOne({
      where: {
        userId: params?.userId,
        dmlStatus: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${params.userId} not found or has been removed already.`);
    }

    const sales = await this.cardSummaryRepository.find({
      where: [{ shopKeepId: res }, { customerId: res }],
    });

    if (sales.length > 0) {
      throw new BadRequestException('User cannot be deleted because there are sales associated with this user.');
    }

    res.dmlStatus = 2; // Set dml_status to 2 for delete
    await this.userRepository.save(res);  
  }
}
