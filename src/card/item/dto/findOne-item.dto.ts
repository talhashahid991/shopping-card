import {IsNumber} from 'class-validator';

export class FindOneItemDto {
  @IsNumber()
  item_id: number;
}

