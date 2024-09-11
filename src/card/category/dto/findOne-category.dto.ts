import {IsNumber} from 'class-validator';

export class FindOneCategoryDto {
  @IsNumber()
  category_id: number;
}

