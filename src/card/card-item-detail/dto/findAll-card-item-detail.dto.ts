import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { PaginationDto } from 'src/card/utils/pagination.dto';

export class FindAllCardItemDetailsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  cardSummaryId?: number; 

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