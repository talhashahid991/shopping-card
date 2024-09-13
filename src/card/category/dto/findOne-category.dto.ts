import {IsNumber} from 'class-validator';

export class FindOneCategoryDto {
  @IsNumber()
  categoryId: number;
}

