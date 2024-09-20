import { IsString, IsNumber } from 'class-validator';

export class CreateItemDto {

  @IsString()
  itemName: string;

  @IsNumber()
  price: number;

  @IsNumber()
  categoryId: number;
}
