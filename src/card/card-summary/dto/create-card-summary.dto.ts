import { IsInt, IsBoolean, IsNumber } from 'class-validator';

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

  