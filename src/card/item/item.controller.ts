// src/items/items.controller.ts

import {Res, HttpStatus, Controller, Post, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindOneItemDto } from './dto/findOne-item.dto';

@Controller('Items')
export class ItemsController {
  constructor(private readonly itemService: ItemService) {}

  @Post('addItem')
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Post('findAll')
  findAll() {
    return this.itemService.findAll();
  }

  @Post('findOne')
  findOne(@Body() findOneItemDto: FindOneItemDto) {
    return this.itemService.findOne(findOneItemDto);
  }

  @Post('updateItem')
  update(@Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(updateItemDto);
  }

  @Post('deleteItem')
  async remove(@Body() findOneItemDto: FindOneItemDto, @Res() res: Response) {
    try {
      await this.itemService.remove(findOneItemDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
