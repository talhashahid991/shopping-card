import { IsInt, IsBoolean, IsNumber } from 'class-validator';

export class CreateCartSummaryDto {
  @IsNumber()
  totalAmount: number;

  @IsInt()
  shopKeepId: number;

  @IsInt()
  customerId: number;

  @IsBoolean()
  soldStatus: boolean;
}

  