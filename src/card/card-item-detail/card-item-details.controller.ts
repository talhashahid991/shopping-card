import { Res, HttpStatus, NotFoundException, BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { CardItemDetailsService } from './card-item-details.service';
import { CreateCardItemDetailsDto } from './dto/create-card-item-detail.dto';
import { UpdateCardItemDetailsDto } from './dto/update-card-item-details.dto';
import { FindOneCardItemDetailDto } from './dto/findOne-card-item-detail.dto';
import { FindAllCardItemDetailsDto } from './dto/findAll-card-item-detail.dto';


@Controller('CardItemDetail')
export class CardItemDetailsController {
  constructor(private readonly cardItemDetailsService: CardItemDetailsService) {}

  @Post('addCardItemDetail')
  create(@Body() createCardItemDetailsDto: CreateCardItemDetailsDto) {
    return this.cardItemDetailsService.create(createCardItemDetailsDto);
  }

  @Post('findAll')
  findAll(@Body() findAllCardItemDetailsDto:FindAllCardItemDetailsDto) {
    return this.cardItemDetailsService.findAll(findAllCardItemDetailsDto);
  }

  @Post('findOne')
  findOne(@Body() findOneCardItemDetailDto: FindOneCardItemDetailDto) {
    return this.cardItemDetailsService.findOne(findOneCardItemDetailDto);
  }

  @Post('updateCardItemDetail')
  update(@Body() updateCardItemDetailsDto: UpdateCardItemDetailsDto) {
    return this.cardItemDetailsService.update(updateCardItemDetailsDto);
  }

  @Post('deleteCardItemDetail')
  async remove(@Body() findOneCardItemDetailDto: FindOneCardItemDetailDto, @Res() res: Response) {
    try {
      await this.cardItemDetailsService.remove(findOneCardItemDetailDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}
