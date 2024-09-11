import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

import { FindOneItemDto } from './dto/findOne-item.dto';
import { Category } from '../category/entities/category.entity';

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
    const category = await this.categoryRepository.findOneBy({ category_id: createItemDto.category_id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const item = this.itemsRepository.create({
      item_name: createItemDto.item_name,
      price: createItemDto.price,
      category_id: category,
      dml_status: 1, // Set dml_status to 1 for insert
    });

    return this.itemsRepository.save(item);
  }


  async update(updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOne({
      where: {
        item_id: updateItemDto?.item_id,
        dml_status: Not(2),
      },
    });
    if (!item || item.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${updateItemDto.item_id} not found or has been deleted`);
    }  

    if (updateItemDto.category_id) {
      const category = await this.categoryRepository.findOneBy({ category_id: updateItemDto.category_id });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      item.category_id = category;
    }
    Object.assign(item, updateItemDto);
    item.dml_status = 3; // Set dml_status to 3 for update
    const res = await this.itemsRepository.save(item);
    return await this.itemsRepository.find({
      where: { item_id: res?.item_id },
    });
  }


  findAll(): Promise<Item[]> {
    return this.itemsRepository.find({ where: { dml_status: Not(2) } });
  }

  async findOne(params: FindOneItemDto): Promise<Item> {
    const user = await this.itemsRepository.findOne({ 
      where : {item_id: params?.item_id}   
    });
    if (!user || user.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${params.item_id} not found or has been deleted`);
    }
    return user;
  }

  async remove(params: FindOneItemDto) {
    const res = await this.itemsRepository.findOne({
      where: {
        item_id: params?.item_id,
        dml_status: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${params.item_id} not found or has been deleted`);
    }

    res.dml_status = 2; // Set dml_status to 2 for delete
    await this.itemsRepository.save(res);  
  }
}
