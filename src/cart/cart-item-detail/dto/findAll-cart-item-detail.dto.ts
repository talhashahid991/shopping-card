import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { PaginationDto } from 'src/cart/utils/pagination.dto';

export class FindAllCartItemDetailsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  cartSummaryId?: number; 

  @IsOptional()
  @IsInt()
  shopKeepId?: number; 

  @IsOptional()
  @IsInt()
  customerId?: number; 

  @IsOptional()
  @IsInt()
  itemId?: number;

  @IsOptional()
  @IsNumber()
  totalAmount?: number; 

  @IsOptional()
  @IsInt()
  quantity?: number;

}