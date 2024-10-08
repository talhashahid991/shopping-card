import { Res, HttpStatus, NotFoundException, BadRequestException, Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneUserDto } from './dto/findOne-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { RolesGuard } from '../../auth/roles-guard.guard';
import { Role, Roles } from '../../auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addUser')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('findAll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Customer)
  findAll(@Body() findAllUserDto:FindAllUserDto) {
    return this.userService.findAll(findAllUserDto);
  }

  @Post('findOne')
  findOne(@Body() findOneUserDto: FindOneUserDto) {
    return this.userService.findOne(findOneUserDto);
  }

  @Post('updateUser')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Post('deleteUser')
  async remove(@Body() findOneUserDto: FindOneUserDto, @Res() res: Response) {
    try {
      await this.userService.remove(findOneUserDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
