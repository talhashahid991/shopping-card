import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { Category } from '../entities/category.entity';

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
      dml_status: 1, // Set dml_status to 1 for insert
    });

    item.category_id = category;

    return this.itemsRepository.save(item);
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ item_id: id });
    if (!item || item.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${id} not found or has been deleted`);
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
    return this.itemsRepository.save(item);
  }

  findAll(): Promise<Item[]> {
    return this.itemsRepository.find({ where: { dml_status: Not(2) } });
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ item_id: id });
    if (!item || item.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${id} not found or has been deleted`);
    }
    return item;
  }

  async remove(id: number): Promise<void> {
    const item = await this.itemsRepository.findOneBy({ item_id: id });
    if (!item || item.dml_status === 2) {
      throw new NotFoundException(`Item with ID ${id} not found or has been deleted`);
    }

    item.dml_status = 2; // Set dml_status to 2 for delete
    await this.itemsRepository.save(item);
  }
}
