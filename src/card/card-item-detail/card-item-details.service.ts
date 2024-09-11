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
    const cardSummary = await this.cardSummaryRepository.findOneBy({ card_summary_id: createCardItemDetailsDto.card_summary_id });
    if (!cardSummary) {
      throw new Error('Card summary not found');
    }

    const item = await this.itemRepository.findOneBy({ item_id: createCardItemDetailsDto.item_id });
    if (!item) {
      throw new Error('Item not found');
    }

    const cardItemDetails = this.cardItemDetailsRepository.create({
      item_price: createCardItemDetailsDto.item_price,
      quantity: createCardItemDetailsDto.quantity,
      card_summary: cardSummary,
      item: item,
      dml_status: 1,
    });

    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  findAll(): Promise<CardItemDetails[]> {
    return this.cardItemDetailsRepository.find();
  }

  async findOne(params: FindOneCardItemDetailDto): Promise<CardItemDetails> {
    const category = await this.cardItemDetailsRepository.findOne({ 
      where : {card_item_details_id: params?.card_item_details_id}   
    });
    if (!category || category.dml_status === 2) {
      throw new NotFoundException(`Detail with ID ${params.card_item_details_id} not found or has been deleted`);
    }
    return category;
  }

  async update(updateCardItemDetailsDto: UpdateCardItemDetailsDto): Promise<CardItemDetails> {
    const cardItemDetails = await this.cardItemDetailsRepository.findOne({
      where: {
        card_item_details_id: updateCardItemDetailsDto?.card_item_details_id,
        dml_status: Not(2),
      },
    });
    if (!cardItemDetails) {
      throw new Error('Card item details not found');
    }

    if (updateCardItemDetailsDto.card_summary_id) {
      const cardSummary = await this.cardSummaryRepository.findOneBy({ card_summary_id: updateCardItemDetailsDto.card_summary_id });
      if (!cardSummary) {
        throw new Error('Card summary not found');
      }
      cardItemDetails.card_summary = cardSummary;
    }

    if (updateCardItemDetailsDto.item_id) {
      const item = await this.itemRepository.findOneBy({ item_id: updateCardItemDetailsDto.item_id });
      if (!item) {
        throw new Error('Item not found');
      }
      cardItemDetails.item = item;
    }

    Object.assign(cardItemDetails, updateCardItemDetailsDto);
    cardItemDetails.dml_status = 3;
    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  async remove(params: FindOneCardItemDetailDto) {
    const res = await this.cardItemDetailsRepository.findOne({
      where: {
        card_item_details_id: params?.card_item_details_id,
        dml_status: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`Detail with ID ${params.card_item_details_id} not found or has been deleted`);
    }

    res.dml_status = 2; // Set dml_status to 2 for delete
    await this.cardItemDetailsRepository.save(res);  
  }
}
