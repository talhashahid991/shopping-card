import { IsOptional, IsInt, IsNumber, IsBoolean } from 'class-validator';
import { PaginationDto } from 'src/card/utils/pagination.dto';


export class FindAllCardSummaryDto extends PaginationDto{
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