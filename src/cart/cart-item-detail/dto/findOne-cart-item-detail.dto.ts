import {IsNumber} from 'class-validator';

export class FindOneCartItemDetailDto {
  @IsNumber()
  cartItemDetailsId: number;
}

