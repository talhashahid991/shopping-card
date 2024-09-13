import {IsNumber} from 'class-validator';

export class FindOneCardItemDetailDto {
  @IsNumber()
  cardItemDetailsId: number;
}

