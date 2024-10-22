import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCartItemDetailsDto {
  @IsOptional()
  @IsInt()
  cartSummaryId?: number; //optional for first item

  @IsOptional()
  @IsInt()
  shopKeepId?: number; // Required for creating a new CartSummary

  @IsOptional()
  @IsInt()
  customerId?: number; // Required for creating a new CartSummary

  @IsInt()
  itemId: number;

  @IsOptional()
  @IsNumber()
  totalAmount?: number; //will be calculated automatically through code

  @IsNotEmpty()
  @IsInt()
  quantity: number;

}
