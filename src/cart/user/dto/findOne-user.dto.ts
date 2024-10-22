import { IsNumber } from 'class-validator';

export class FindOneUserDto {
  @IsNumber()
  userId: number;
}

