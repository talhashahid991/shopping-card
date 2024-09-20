import { IsString, IsEnum, IsOptional } from 'class-validator';
import { UserType } from '../entities/user.entity';
import { PaginationDto } from 'src/card/utils/pagination.dto';

export class FindAllUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(UserType, {
    message: 'userType must be one of the following values: shopkeep, customer',
  })
  userType?: UserType;

}