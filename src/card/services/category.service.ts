import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';


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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({category_id: id });
    if (!category || category.dml_status === 2) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (category.dml_status === 2) {
      throw new BadRequestException(`Category with ID ${id} cannot be updated`);
    }
    await this.categoriesRepository.update(id, {
      ...updateCategoryDto,
      dml_status: 3, // Set dml_status to 3 for update
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    if (category.dml_status === 2) {
      throw new BadRequestException(`Category with ID ${id} cannot be deleted`);
    }
    category.dml_status = 2;
    await this.categoriesRepository.save(category);
  }
}
