import { Res, HttpStatus, NotFoundException, BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { CartSummaryService } from './cart-summary.service';
import { CreateCartSummaryDto } from './dto/create-cart-summary.dto';
import { UpdateCartSummaryDto } from './dto/update-cart-summary.dto';
import { FindOneCartSummaryDto } from './dto/findOne-cart-summary.dto';
import { GetSoldHistoryDto } from './dto/soldHistory-cart-summary.dto';
import { CartSummary } from './entities/cart-summary.entity';
import { FindAllCartSummaryDto } from './dto/findAll-cart-summary.dto';

@Controller('CartSummary')
export class CartSummaryController {
  constructor(private readonly cartSummaryService: CartSummaryService) {}

  @Post('addCartSummary')
  create(@Body() createCartSummaryDto: CreateCartSummaryDto) {
    return this.cartSummaryService.create(createCartSummaryDto);
  }

  @Post('findAll')
  findAll(@Body() findAllCartSummaryDto:FindAllCartSummaryDto) {
    return this.cartSummaryService.findAll(findAllCartSummaryDto);
  }

  @Post('findOne')
  findOne(@Body() findOneCartSummaryDto: FindOneCartSummaryDto) {
    return this.cartSummaryService.findOne(findOneCartSummaryDto);
  }

  @Post('getSoldHistory') 
  async getSoldHistory(@Body() getSoldHistoryDto: GetSoldHistoryDto): Promise<CartSummary[]> { 
    return this.cartSummaryService.getSoldHistory(getSoldHistoryDto.shopKeepId); 
  } 

  @Post('updateCartSummary')
  update(@Body() updateCartSummaryDto: UpdateCartSummaryDto) {
    return this.cartSummaryService.update(updateCartSummaryDto);
  }

  @Post('deleteCartSummary')
  async remove(@Body() findOneCartSummaryDto: FindOneCartSummaryDto, @Res() res: Response) {
    try {
      await this.cartSummaryService.remove(findOneCartSummaryDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}

