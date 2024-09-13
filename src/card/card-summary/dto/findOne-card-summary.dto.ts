import {IsNumber} from 'class-validator';

export class FindOneCardSummaryDto {
  @IsNumber()
  cardSummaryId: number;
}

