import { IsOptional, IsInt, IsNumber, IsBoolean } from 'class-validator';
import { PaginationDto } from 'src/cart/utils/pagination.dto';


export class FindAllCartSummaryDto extends PaginationDto{
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsInt()
  shopKeepId?: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsBoolean()
  soldStatus?: boolean;

}