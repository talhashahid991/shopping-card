import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CardSummary } from '../card-summary/entities/card-summary.entity';
import { FindOneUserDto } from './dto/findOne-user.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CardSummary)
    private cardSummaryRepository: Repository<CardSummary>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
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
    } catch(e){
      return e
    }
    
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.find({
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
      
    if (user.length > 0) {
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


  findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { dmlStatus: Not(2) } });
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
    return this.userRepository.find({ where: { dmlStatus: Not(2) } });
  }
}
