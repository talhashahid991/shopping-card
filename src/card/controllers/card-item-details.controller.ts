import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CardItemDetailsService } from '../services/card-item-details.service';
import { CreateCardItemDetailsDto } from '../dto/create-card-item-detail.dto';
import { UpdateCardItemDetailsDto } from '../dto/update-card-item-details.dto';


@Controller('card-item-details')
export class CardItemDetailsController {
  constructor(private readonly cardItemDetailsService: CardItemDetailsService) {}

  @Post()
  create(@Body() createCardItemDetailsDto: CreateCardItemDetailsDto) {
    return this.cardItemDetailsService.create(createCardItemDetailsDto);
  }

  @Get()
  findAll() {
    return this.cardItemDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardItemDetailsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCardItemDetailsDto: UpdateCardItemDetailsDto) {
    return this.cardItemDetailsService.update(+id, updateCardItemDetailsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardItemDetailsService.remove(+id);
  }
}
