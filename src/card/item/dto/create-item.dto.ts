// src/items/dto/create-item.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateItemDto {

  @IsString()
  item_name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  category_id: number;
}
