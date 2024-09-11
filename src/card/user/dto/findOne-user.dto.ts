import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class FindOneUserDto {
  @IsNumber()
  user_id: number;
}

