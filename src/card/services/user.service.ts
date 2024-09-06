import { BadRequestException, Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CardSummary } from '../entities/card-summary';


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
      return this.userRepository.save(user);
    } catch(e){
      return e
    }
    
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({user_id: id});
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    user.dml_status = 3; // Set dml_status to 3 (update)
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { dml_status: Not(2) } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({user_id: id });
    if (!user || user.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${id} not found or has been deleted`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ user_id: id });
    if (!user || user.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${id} not found or has been deleted`);
    }

    const sales = await this.cardSummaryRepository.find({
      where: [{ shop_keep_id: user }, { customer_id: user }],
    });

    if (sales.length > 0) {
      throw new BadRequestException('User cannot be deleted because there are sales associated with this user.');
    }

    user.dml_status = 2; // Set dml_status to 2 for delete
    await this.userRepository.save(user);
  }
}
