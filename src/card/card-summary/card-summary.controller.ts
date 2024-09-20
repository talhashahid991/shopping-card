import { Res, HttpStatus, NotFoundException, BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { CardSummaryService } from './card-summary.service';
import { CreateCardSummaryDto } from './dto/create-card-summary.dto';
import { UpdateCardSummaryDto } from './dto/update-card-summary.dto';
import { FindOneCardSummaryDto } from './dto/findOne-card-summary.dto';
import { GetSoldHistoryDto } from './dto/soldHistory-card-summary.dto';
import { CardSummary } from './entities/card-summary.entity';
import { FindAllCardSummaryDto } from './dto/findAll-card-summary.dto';

@Controller('CardSummary')
export class CardSummaryController {
  constructor(private readonly cardSummaryService: CardSummaryService) {}

  @Post('addCardSummary')
  create(@Body() createCardSummaryDto: CreateCardSummaryDto) {
    return this.cardSummaryService.create(createCardSummaryDto);
  }

  @Post('findAll')
  findAll(@Body() findAllCardSummaryDto:FindAllCardSummaryDto) {
    return this.cardSummaryService.findAll(findAllCardSummaryDto);
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
  async remove(@Body() findOneCardSummaryDto: FindOneCardSummaryDto, @Res() res: Response) {
    try {
      await this.cardSummaryService.remove(findOneCardSummaryDto);
      return res.status(HttpStatus.OK).json({ message: 'Removed Successfully' });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }
}

