import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CardSummaryService } from '../services/card-summary.service';
import { CreateCardSummaryDto } from '../dto/create-card-summary.dto';
import { UpdateCardSummaryDto } from '../dto/update-card-summary.dto';

@Controller('card-summaries')
export class CardSummaryController {
  constructor(private readonly cardSummaryService: CardSummaryService) {}

  @Post()
  create(@Body() createCardSummaryDto: CreateCardSummaryDto) {
    return this.cardSummaryService.create(createCardSummaryDto);
  }

  @Get()
  findAll() {
    return this.cardSummaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardSummaryService.findOne(+id);
  }

  @Get('history/:shopKeepId')
  async getSoldHistory(@Param('shopKeepId') shopKeepId: number) {
    return this.cardSummaryService.getSoldHistory(shopKeepId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCardSummaryDto: UpdateCardSummaryDto) {
    return this.cardSummaryService.update(+id, updateCardSummaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardSummaryService.remove(+id);
  }
}

