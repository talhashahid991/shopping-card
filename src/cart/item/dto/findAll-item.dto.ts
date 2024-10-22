import { IsString, IsOptional, IsNumber } from 'class-validator';
import { PaginationDto } from 'src/cart/utils/pagination.dto';


export class FindAllItemDto extends PaginationDto {
  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

}