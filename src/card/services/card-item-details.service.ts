import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardItemDetails } from '../entities/card-item-detail.entity';
import { CardSummary } from '../entities/card-summary';
import { Item } from '../entities/item.entity';
import { CreateCardItemDetailsDto } from '../dto/create-card-item-detail.dto';
import { UpdateCardItemDetailsDto } from '../dto/update-card-item-details.dto';


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
    });

    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  findAll(): Promise<CardItemDetails[]> {
    return this.cardItemDetailsRepository.find();
  }

  findOne(id: number): Promise<CardItemDetails> {
    return this.cardItemDetailsRepository.findOneBy({ card_item_details_id: id });
  }

  async update(id: number, updateCardItemDetailsDto: UpdateCardItemDetailsDto): Promise<CardItemDetails> {
    const cardItemDetails = await this.cardItemDetailsRepository.findOneBy({ card_item_details_id: id });
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
    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  async remove(id: number): Promise<void> {
    await this.cardItemDetailsRepository.delete(id);
  }
}
