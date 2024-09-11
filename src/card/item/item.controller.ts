// src/items/items.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FindOneItemDto } from './dto/findOne-item.dto';

@Controller('items')
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
  remove(@Body() findOneItemDto: FindOneItemDto) {
    return this.itemService.remove(findOneItemDto);
  }
}
