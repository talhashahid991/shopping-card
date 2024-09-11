import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindOneCategoryDto } from './dto/findOne-category.dto';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      dml_status: 1, // Set dml_status to 1 for insert
    });
    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ where: { dml_status: Not(2) } });
  }

  async findOne(params: FindOneCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ 
      where : {category_id: params?.category_id}   
    });
    if (!category || category.dml_status === 2) {
      throw new NotFoundException(`Category with ID ${params.category_id} not found or has been deleted`);
    }
    return category;
  }

  async update(updateCtegoryDto: UpdateCategoryDto) {
    const user = await this.categoriesRepository.find({
      where: {
        category_id: updateCtegoryDto?.category_id,
        dml_status:Not(2),
      },
    });
      
    if (user.length > 0) {
      const res = await this.categoriesRepository.save({
        ...updateCtegoryDto,
        dml_status: 3, //dml_Status to 3 for update
      });
      return await this.categoriesRepository.find({
        where: { category_id: res?.category_id },
      });
      } else {
        throw new NotFoundException(`User with ID ${updateCtegoryDto.category_id} not found or has been deleted`);
      }
  }

  async remove(params: FindOneCategoryDto) {
    const res = await this.categoriesRepository.findOne({
      where: {
        category_id: params?.category_id,
        dml_status: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${params.category_id} not found or has been deleted`);
    }

    res.dml_status = 2; // Set dml_status to 2 for delete
    await this.categoriesRepository.save(res);  
  }
}
