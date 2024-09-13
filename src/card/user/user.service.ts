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
        user_type: createUserDto.user_type,
        dml_status: 1}) // Set dml_status to 1 for insert});
      
      const userExist = await this.userRepository.find({
        where :{
          username: createUserDto?.username,
          dml_status:Not(2),
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
        user_id: updateUserDto?.user_id,
        dml_status:Not(2),
      },
    });
      
    if (user.length > 0) {
      const res = await this.userRepository.save({
        ...updateUserDto,
        dml_status: 3, //dml_Status to 3 for update
      });
      return await this.userRepository.find({
        where: { user_id: res?.user_id },
      });
      } else {
        throw new NotFoundException(`User with ID ${updateUserDto.user_id} not found or has been deleted`);
      }
    }


  findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { dml_status: Not(2) } });
  }

  async findOne(params: FindOneUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where : {user_id: params?.user_id}   
    });
    if (!user || user.dml_status === 2) {
      throw new NotFoundException(`User with ID ${params.user_id} not found or has been deleted`);
    }
    return user;
  }

  async remove(params: FindOneUserDto) {
    const res = await this.userRepository.findOne({
      where: {
        user_id: params?.user_id,
        dml_status: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${params.user_id} not found or has been removed already.`);
    }

    const sales = await this.cardSummaryRepository.find({
      where: [{ shop_keep_id: res }, { customer_id: res }],
    });

    if (sales.length > 0) {
      throw new BadRequestException('User cannot be deleted because there are sales associated with this user.');
    }

    res.dml_status = 2; // Set dml_status to 2 for delete
    await this.userRepository.save(res);  
  }
}
