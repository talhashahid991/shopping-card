import { IsDecimal, IsInt, IsNumber } from 'class-validator';

export class CreateCardItemDetailsDto {
  @IsInt()
  card_summary_id: number;

  @IsInt()
  item_id: number;

  @IsNumber()
  item_price: number;

  @IsInt()
  quantity: number;

}
