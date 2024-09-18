import {Res, HttpStatus, NotFoundException, BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';
import { FindOneCategoryDto } from './dto/findOne-category.dto';


@Controller('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('addCategory')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('findAll')
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
  async remove(@Body() findOneCategoryDto: FindOneCategoryDto, @Res() res: Response) {
    try {
      await this.categoryService.remove(findOneCategoryDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
