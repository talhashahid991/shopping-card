import { IsDecimal, IsInt, IsNumber } from 'class-validator';

export class CreateCardItemDetailsDto {
  @IsInt()
  cardSummaryId: number;

  @IsInt()
  itemId: number;

  @IsNumber()
  itemPrice: number;

  @IsInt()
  quantity: number;

}
