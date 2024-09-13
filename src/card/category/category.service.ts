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
      dmlStatus: 1, // Set dml_status to 1 for insert
    });
    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ where: { dmlStatus: Not(2) } });
  }

  async findOne(params: FindOneCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ 
      where : {categoryId: params?.categoryId}   
    });
    if (!category || category.dmlStatus === 2) {
      throw new NotFoundException(`Category with ID ${params.categoryId} not found or has been deleted`);
    }
    return category;
  }

  async update(updateCtegoryDto: UpdateCategoryDto) {
    const user = await this.categoriesRepository.find({
      where: {
        categoryId: updateCtegoryDto?.categoryId,
        dmlStatus:Not(2),
      },
    });
      
    if (user.length > 0) {
      const res = await this.categoriesRepository.save({
        ...updateCtegoryDto,
        dmlStatus: 3, //dml_Status to 3 for update
      });
      return await this.categoriesRepository.find({
        where: { categoryId: res?.categoryId },
      });
      } else {
        throw new NotFoundException(`User with ID ${updateCtegoryDto.categoryId} not found or has been deleted`);
      }
  }

  async remove(params: FindOneCategoryDto) {
    const res = await this.categoriesRepository.findOne({
      where: {
        categoryId: params?.categoryId,
        dmlStatus: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${params.categoryId} not found or has been deleted`);
    }

    res.dmlStatus = 2; // Set dml_status to 2 for delete
    await this.categoriesRepository.save(res);
    return this.categoriesRepository.find({ where: { dmlStatus: Not(2) } });  
  }
}
