import { IsString, IsInt, MinLength, MaxLength, Matches, IsNotEmpty, IsEnum, isNotEmpty } from 'class-validator';
import { UserType } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType, {
    message: 'user_type must be one of the following values: shopkeep, customer',
  })
  user_type: UserType;

}

