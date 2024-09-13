import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class FindOneUserDto {
  @IsNumber()
  userId: number;
}

