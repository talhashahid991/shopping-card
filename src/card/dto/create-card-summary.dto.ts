import { IsDecimal, IsInt, IsDate, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class CreateCardSummaryDto {
  @IsNumber()
  total_amount: number;

  @IsInt()
  shop_keep_id: number;

  @IsInt()
  customer_id: number;

  @IsDateString()
  sale_date: string;

  @IsBoolean()
  sold_status: boolean;
}

  