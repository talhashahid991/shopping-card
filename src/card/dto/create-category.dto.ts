import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
