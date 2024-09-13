import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CardItemDetails } from './entities/card-item-detail.entity';
import { CardSummary } from '../card-summary/entities/card-summary.entity';
import { Item } from '../item/entities/item.entity';
import { CreateCardItemDetailsDto } from './dto/create-card-item-detail.dto';
import { UpdateCardItemDetailsDto } from './dto/update-card-item-details.dto';
import { FindOneCardItemDetailDto } from './dto/findOne-card-item-detail.dto';


@Injectable()
export class CardItemDetailsService {
  constructor(
    @InjectRepository(CardItemDetails)
    private cardItemDetailsRepository: Repository<CardItemDetails>,
    @InjectRepository(CardSummary)
    private cardSummaryRepository: Repository<CardSummary>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createCardItemDetailsDto: CreateCardItemDetailsDto): Promise<CardItemDetails> {
    const cardSummary = await this.cardSummaryRepository.findOneBy({ cardSummaryId: createCardItemDetailsDto.cardSummaryId });
    if (!cardSummary) {
      throw new Error('Card summary not found');
    }

    const item = await this.itemRepository.findOneBy({ itemId: createCardItemDetailsDto.itemId });
    if (!item) {
      throw new Error('Item not found');
    }

    const cardItemDetails = this.cardItemDetailsRepository.create({
      itemPrice: createCardItemDetailsDto.itemPrice,
      quantity: createCardItemDetailsDto.quantity,
      cardSummary: cardSummary,
      item: item,
      dmlStatus: 1,
    });

    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  findAll(): Promise<CardItemDetails[]> {
    return this.cardItemDetailsRepository.find();
  }

  async findOne(params: FindOneCardItemDetailDto): Promise<CardItemDetails> {
    const category = await this.cardItemDetailsRepository.findOne({ 
      where : {cardItemDetailsId: params?.cardItemDetailsId}   
    });
    if (!category || category.dmlStatus === 2) {
      throw new NotFoundException(`Detail with ID ${params.cardItemDetailsId} not found or has been deleted`);
    }
    return category;
  }

  async update(updateCardItemDetailsDto: UpdateCardItemDetailsDto): Promise<CardItemDetails> {
    const cardItemDetails = await this.cardItemDetailsRepository.findOne({
      where: {
        cardItemDetailsId: updateCardItemDetailsDto?.cardItemDetailsId,
        dmlStatus: Not(2),
      },
    });
    if (!cardItemDetails) {
      throw new Error('Card item details not found');
    }

    if (updateCardItemDetailsDto.cardSummaryId) {
      const cardSummary = await this.cardSummaryRepository.findOneBy({ cardSummaryId: updateCardItemDetailsDto.cardSummaryId });
      if (!cardSummary) {
        throw new Error('Card summary not found');
      }
      cardItemDetails.cardSummary = cardSummary;
    }

    if (updateCardItemDetailsDto.itemId) {
      const item = await this.itemRepository.findOneBy({ itemId: updateCardItemDetailsDto.itemId });
      if (!item) {
        throw new Error('Item not found');
      }
      cardItemDetails.item = item;
    }

    Object.assign(cardItemDetails, updateCardItemDetailsDto);
    cardItemDetails.dmlStatus = 3;
    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  async remove(params: FindOneCardItemDetailDto) {
    const res = await this.cardItemDetailsRepository.findOne({
      where: {
        cardItemDetailsId: params?.cardItemDetailsId,
        dmlStatus: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`Detail with ID ${params.cardItemDetailsId} not found or has been deleted`);
    }

    res.dmlStatus = 2; // Set dml_status to 2 for delete
    await this.cardItemDetailsRepository.save(res);  
    return this.cardItemDetailsRepository.find();
  }
}
