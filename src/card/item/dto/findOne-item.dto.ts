import {IsNumber} from 'class-validator';

export class FindOneItemDto {
  @IsNumber()
  itemId: number;
}

