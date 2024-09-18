import { IsDecimal, IsInt, IsDate, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class CreateCardSummaryDto {
  @IsNumber()
  totalAmount: number;

  @IsInt()
  shopKeepId: number;

  @IsInt()
  customerId: number;

  @IsBoolean()
  soldStatus: boolean;
}

  