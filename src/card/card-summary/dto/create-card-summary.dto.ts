import { IsDecimal, IsInt, IsDate, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class CreateCardSummaryDto {
  @IsNumber()
  totalAmount: number;

  @IsInt()
  shopKeepId: number;

  @IsInt()
  customerId: number;

  @IsDateString()
  saleDate: string;

  @IsBoolean()
  soldStatus: boolean;
}

  