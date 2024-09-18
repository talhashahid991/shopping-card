import { IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCardItemDetailsDto {
  @IsOptional()
  @IsInt()
  cardSummaryId?: number; //optional for first item

  @IsOptional()
  @IsInt()
  shopKeepId?: number; // Required for creating a new CardSummary

  @IsOptional()
  @IsInt()
  customerId?: number; // Required for creating a new CardSummary

  @IsInt()
  itemId: number;

  @IsOptional()
  @IsNumber()
  totalAmount?: number; //will be calculated automatically through code

  @IsNotEmpty()
  @IsInt()
  quantity: number;

}
