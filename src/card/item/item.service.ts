import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like, Equal } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindOneItemDto } from './dto/findOne-item.dto';
import { Category } from '../category/entities/category.entity';
import { FindAllItemDto } from './dto/findAll-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    // look for entered category of an item, if category exists, then proceed
    const category = await this.categoryRepository.findOneBy({ categoryId: createItemDto.categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const item = this.itemsRepository.create({
      itemName: createItemDto.itemName,
      price: createItemDto.price,
      categoryId: category,
      dmlStatus: 1, // Set dml_status to 1 for insert
    });

    return this.itemsRepository.save(item);
  }


  async update(updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOne({
      where: {
        itemId: updateItemDto?.itemId,
        dmlStatus: Not(2),
      },
    });
    if (!item || item.dmlStatus === 2) {
      throw new NotFoundException(`Item with ID ${updateItemDto.itemId} not found or has been deleted`);
    }  

    if (updateItemDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ categoryId: updateItemDto.categoryId });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      item.categoryId = category;
    }
    Object.assign(item, updateItemDto);
    item.dmlStatus = 3; // Set dml_status to 3 for update
    const res = await this.itemsRepository.save(item);
    return await this.itemsRepository.find({
      where: { itemId: res?.itemId },
    });
  }

  async findAll(findallItemDto: FindAllItemDto): Promise<{ data: Item[], count: number }> {
    const page = findallItemDto.page;
    const limit = findallItemDto.limit;
    const { itemName, price, categoryId } = findallItemDto;
    const offset = (page - 1) * limit;
    const [data, count] = await this.itemsRepository.findAndCount({
      where: { dmlStatus: Not(2),
        ...(itemName && { itemName: Like(`%${itemName}%`) }),
        ...(price && { price: Equal(price) }),
        ...(categoryId && { categoryId: Equal(categoryId) }),
       },
      relations: ['categoryId'],
      skip: offset,
      take: limit,
    });
    if(data.length <= 0){
      throw new NotFoundException('No records found.');
    }
    return { data, count };
  }
     

  async findOne(params: FindOneItemDto): Promise<Item> {
    const user = await this.itemsRepository.findOne({ 
      where : {itemId: params?.itemId},
      relations: ['categoryId']   
    });
    if (!user || user.dmlStatus === 2) {
      throw new NotFoundException(`Item with ID ${params.itemId} not found or has been deleted`);
    }
    return user;
  }

  async remove(params: FindOneItemDto) {
    const res = await this.itemsRepository.findOne({
      where: {
        itemId: params?.itemId,
        dmlStatus: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${params.itemId} not found or has been deleted`);
    }

    res.dmlStatus = 2; // Set dml_status to 2 for delete
    await this.itemsRepository.save(res);  
  }
}
