import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CardSummaryService } from './card-summary.service';
import { CreateCardSummaryDto } from './dto/create-card-summary.dto';
import { UpdateCardSummaryDto } from './dto/update-card-summary.dto';
import { FindOneCardSummaryDto } from './dto/findOne-card-summary.dto';
import { CardSummary } from './entities/card-summary.entity';
import { GetSoldHistoryDto } from './dto/soldHistory-card-summary.dto';

@Controller('card-summary')
export class CardSummaryController {
  constructor(private readonly cardSummaryService: CardSummaryService) {}

  @Post('addCardSummary')
  create(@Body() createCardSummaryDto: CreateCardSummaryDto) {
    return this.cardSummaryService.create(createCardSummaryDto);
  }

  @Post('findAll')
  findAll() {
    return this.cardSummaryService.findAll();
  }

  @Post('findOne')
  findOne(@Body() findOneCardSummaryDto: FindOneCardSummaryDto) {
    return this.cardSummaryService.findOne(findOneCardSummaryDto);
  }

  @Post('getSoldHistory') 
  async getSoldHistory(@Body() getSoldHistoryDto: GetSoldHistoryDto): Promise<CardSummary[]> { 
    return this.cardSummaryService.getSoldHistory(getSoldHistoryDto.shopKeepId); 
  } 

  @Post('updateCardSummary')
  update(@Body() updateCardSummaryDto: UpdateCardSummaryDto) {
    return this.cardSummaryService.update(updateCardSummaryDto);
  }

  @Post('deleteCardSummary')
  remove(@Body() findOneCardSummaryDto: FindOneCardSummaryDto) {
    return this.cardSummaryService.remove(findOneCardSummaryDto);
  }
}

