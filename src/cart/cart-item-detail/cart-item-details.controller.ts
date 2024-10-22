import { Res, HttpStatus, NotFoundException, BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { CartItemDetailsService } from './cart-item-details.service';
import { CreateCartItemDetailsDto } from './dto/create-cart-item-detail.dto';
import { UpdateCartItemDetailsDto } from './dto/update-cart-item-details.dto';
import { FindOneCartItemDetailDto } from './dto/findOne-cart-item-detail.dto';
import { FindAllCartItemDetailsDto } from './dto/findAll-cart-item-detail.dto';


@Controller('CartItemDetail')
export class CartItemDetailsController {
  constructor(private readonly cartItemDetailsService: CartItemDetailsService) {}

  @Post('addCartItemDetail')
  create(@Body() createCartItemDetailsDto: CreateCartItemDetailsDto) {
    return this.cartItemDetailsService.create(createCartItemDetailsDto);
  }

  @Post('findAll')
  findAll(@Body() findAllCartItemDetailsDto:FindAllCartItemDetailsDto) {
    return this.cartItemDetailsService.findAll(findAllCartItemDetailsDto);
  }

  @Post('findOne')
  findOne(@Body() findOneCartItemDetailDto: FindOneCartItemDetailDto) {
    return this.cartItemDetailsService.findOne(findOneCartItemDetailDto);
  }

  @Post('updateCartItemDetail')
  update(@Body() updateCartItemDetailsDto: UpdateCartItemDetailsDto) {
    return this.cartItemDetailsService.update(updateCartItemDetailsDto);
  }

  @Post('deleteCartItemDetail')
  async remove(@Body() findOneCartItemDetailDto: FindOneCartItemDetailDto, @Res() res: Response) {
    try {
      await this.cartItemDetailsService.remove(findOneCartItemDetailDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
