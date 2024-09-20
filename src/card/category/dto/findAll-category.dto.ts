import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/card/utils/pagination.dto';


export class FindAllCategoryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

}