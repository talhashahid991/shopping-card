// src/items/items.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemService } from '../services/item.service';
import { ItemsController } from '../controllers/item.controller';
import { Item } from '../entities/item.entity';
import { CategoryModule } from './category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]),CategoryModule],
  controllers: [ItemsController],
  providers: [ItemService],
  exports:[TypeOrmModule]
})
export class ItemModule {}

