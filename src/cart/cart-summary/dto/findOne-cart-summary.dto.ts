import {IsNumber} from 'class-validator';

export class FindOneCartSummaryDto {
  @IsNumber()
  cartSummaryId: number;
}

