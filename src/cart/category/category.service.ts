import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindOneCategoryDto } from './dto/findOne-category.dto';
import { FindAllCategoryDto } from './dto/findAll-category.dto';


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

  async findAll(findAllCategoryDto:FindAllCategoryDto): Promise<{ data: Category[], count: number }> {
    const page = findAllCategoryDto.page;
    const limit = findAllCategoryDto.limit;
    const { title, description} = findAllCategoryDto;
    const offset = (page - 1) * limit;
    const [data, count] = await this.categoriesRepository.findAndCount({
      where: { dmlStatus: Not(2),
        ...(title && { title: Like(`%${title}%`) }),
        ...(description && { description: Like(`%${description}%`) }),
       },
      skip: offset,
      take: limit,
    });
    if(data.length <= 0){
      throw new NotFoundException('No records found.');
    }
    return { data, count };
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
  }
}
