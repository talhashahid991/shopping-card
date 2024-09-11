// src/items/items.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemService } from '../item/item.service';
import { ItemsController } from './item.controller';
import { CategoryModule } from '../category/category.module';
import { Item } from './entities/item.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Item]),CategoryModule],
  controllers: [ItemsController],
  providers: [ItemService],
  exports:[TypeOrmModule]
})
export class ItemModule {}

