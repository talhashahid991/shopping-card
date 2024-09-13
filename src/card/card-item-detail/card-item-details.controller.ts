import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CardItemDetailsService } from './card-item-details.service';
import { CreateCardItemDetailsDto } from './dto/create-card-item-detail.dto';
import { UpdateCardItemDetailsDto } from './dto/update-card-item-details.dto';
import { FindOneCardItemDetailDto } from './dto/findOne-card-item-detail.dto';


@Controller('card-item-detail')
export class CardItemDetailsController {
  constructor(private readonly cardItemDetailsService: CardItemDetailsService) {}

  @Post('addCardItemDetail')
  create(@Body() createCardItemDetailsDto: CreateCardItemDetailsDto) {
    return this.cardItemDetailsService.create(createCardItemDetailsDto);
  }

  @Post('findAll')
  findAll() {
    return this.cardItemDetailsService.findAll();
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
  remove(@Body() findOneCardItemDetailDto: FindOneCardItemDetailDto) {
    return this.cardItemDetailsService.remove(findOneCardItemDetailDto);
  }
}
