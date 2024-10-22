import { IsString, MinLength, MaxLength, Matches, IsNotEmpty, IsEnum } from 'class-validator';
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
    message: 'userType must be one of the following values: shopkeep, customer',
  })
  userType: UserType;

}

