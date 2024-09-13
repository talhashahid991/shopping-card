// src/items/dto/create-item.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateItemDto {

  @IsString()
  itemName: string;

  @IsNumber()
  price: number;

  @IsNumber()
  categoryId: number;
}
