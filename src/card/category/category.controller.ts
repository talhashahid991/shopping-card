import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';
import { FindOneCategoryDto } from './dto/findOne-category.dto';


@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('findAll')
  findAll() {
    return this.categoryService.findAll();
  }

  @Post('findOne')
  findOne(@Body() findOneCategoryDto: FindOneCategoryDto) {
    return this.categoryService.findOne(findOneCategoryDto);
  }

  @Post('updateCategory')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Post('deleteCategory')
  remove(@Body() findOneCategoryDto: FindOneCategoryDto) {
    return this.categoryService.remove(findOneCategoryDto);
  }
}
