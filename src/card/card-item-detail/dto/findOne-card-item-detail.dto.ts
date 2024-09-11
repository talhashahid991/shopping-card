import {IsNumber} from 'class-validator';

export class FindOneCardItemDetailDto {
  @IsNumber()
  card_item_details_id: number;
}

