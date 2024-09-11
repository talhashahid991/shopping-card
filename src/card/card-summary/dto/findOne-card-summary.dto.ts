import {IsNumber} from 'class-validator';

export class FindOneCardSummaryDto {
  @IsNumber()
  card_summary_id: number;
}

