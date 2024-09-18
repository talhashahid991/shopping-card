import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CardItemDetails } from './entities/card-item-detail.entity';
import { CardSummary } from '../card-summary/entities/card-summary.entity';
import { Item } from '../item/entities/item.entity';
import { CreateCardItemDetailsDto } from './dto/create-card-item-detail.dto';
import { UpdateCardItemDetailsDto } from './dto/update-card-item-details.dto';
import { FindOneCardItemDetailDto } from './dto/findOne-card-item-detail.dto';
import { User, UserType } from '../user/entities/user.entity';


@Injectable()
export class CardItemDetailsService {
  constructor(
    @InjectRepository(CardItemDetails)
    private cardItemDetailsRepository: Repository<CardItemDetails>,
    @InjectRepository(CardSummary)
    private cardSummaryRepository: Repository<CardSummary>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createcardItemDetailDto: CreateCardItemDetailsDto): Promise<CardItemDetails> {
    let cardSummary: CardSummary;

    if (createcardItemDetailDto.cardSummaryId) {
      // Find the existing CardSummary
      cardSummary = await this.cardSummaryRepository.findOne({
        where: { cardSummaryId: createcardItemDetailDto.cardSummaryId },
      });

      if (!cardSummary || cardSummary.soldStatus === true) {
        throw new Error(`CardSummary with ID ${createcardItemDetailDto.cardSummaryId} not found`);
      }
    } else {
      // Create a new CardSummary
      
    //confusion can occur here because shopkeep n customer ids are being passed as types of userRepository directly to 
    //cardSummaryRepository. Type numbers for these id's in createcardItemDetailDto are only being used as input comparison 
    //for searching the existence of user type
    const shopKeep = await this.userRepository.findOneBy({ userId: createcardItemDetailDto.shopKeepId, userType: UserType.SHOP_KEEP });
    if (!shopKeep) {
      throw new NotFoundException('Shop keep not found');
    }

    const customer = await this.userRepository.findOneBy({ userId: createcardItemDetailDto.customerId, userType: UserType.CUSTOMER });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

      cardSummary = this.cardSummaryRepository.create({
        totalAmount: 0, //initial amount is 0
        shopKeepId: shopKeep,
        customerId: customer,
        saleDate: new Date().toISOString(),
        dmlStatus: 1, // Assuming 1 means "insert"
        soldStatus: false, // Assuming initial sold status is false
      });
      await this.cardSummaryRepository.save(cardSummary);
    }

    // fetch the item and its price for CardItemDetail
    const item = await this.itemRepository.findOneBy({ itemId: createcardItemDetailDto.itemId });
       if (!item) {
         throw new NotFoundException('Item not found');
       }

    // Calculate the total amount for the CardItemDetail
    const totalAmount = item.price * createcardItemDetailDto.quantity;

    const cardItemDetail = this.cardItemDetailsRepository.create({
      cardSummary: cardSummary,
      item: item,
      quantity: createcardItemDetailDto.quantity,
      totalAmount: totalAmount,
      dmlStatus: 1,
    });
    await this.cardItemDetailsRepository.save(cardItemDetail);

    // Update the total amount in CardSummary
    cardSummary.totalAmount += cardItemDetail.totalAmount;
    await this.cardSummaryRepository.save(cardSummary);

    return cardItemDetail;
  }

  findAll(): Promise<CardItemDetails[]> {
    return this.cardItemDetailsRepository.find({   
      where: { dmlStatus: Not(2) },
      relations: ['item','cardSummary'],
    });
  }

  async findOne(params: FindOneCardItemDetailDto): Promise<CardItemDetails> {
    const category = await this.cardItemDetailsRepository.findOne({ 
      where : {cardItemDetailsId: params?.cardItemDetailsId},
      relations: ['item','cardSummary']  
    });
    if (!category || category.dmlStatus === 2) {
      throw new NotFoundException(`Detail with ID ${params.cardItemDetailsId} not found or has been deleted`);
    }
    return category;
  }

  async update(updatecardItemDetailsDto: UpdateCardItemDetailsDto): Promise<CardItemDetails> {
    const cardItemDetails = await this.cardItemDetailsRepository.findOne({
      where: {
        cardItemDetailsId: updatecardItemDetailsDto?.cardItemDetailsId,
        dmlStatus: Not(2),
      },
    });
    if (!cardItemDetails) {
      throw new NotFoundException('card item details not found');
    }

    const cardSummary = await this.cardSummaryRepository.findOne({
      where: { cardSummaryId: updatecardItemDetailsDto.cardSummaryId },
    });

    if (!cardSummary) {
      throw new NotFoundException(`CartSummary with ID ${updatecardItemDetailsDto.cardSummaryId} not found`);
    }

    let item = cardItemDetails.item;
    if (updatecardItemDetailsDto.itemId) {
      item = await this.itemRepository.findOneBy({ itemId: updatecardItemDetailsDto.itemId });
      if (!item) {
        throw new NotFoundException('Item not found');
      }
      cardItemDetails.item = item;
    }

    // Calculate the difference in total amount
    const oldTotalAmount = cardItemDetails.totalAmount;
    const newTotalAmount = item.price * updatecardItemDetailsDto.quantity;
    const amountDifference = newTotalAmount - oldTotalAmount;

    // Update the CardItemDetails
    Object.assign(cardItemDetails, updatecardItemDetailsDto);
    cardItemDetails.totalAmount = newTotalAmount;
    cardItemDetails.dmlStatus = 3;
    await this.cardItemDetailsRepository.save(cardItemDetails);

    // Update the total amount in CardSummary
    cardSummary.totalAmount += amountDifference;
    await this.cardSummaryRepository.save(cardSummary);
    
    return this.cardItemDetailsRepository.save(cardItemDetails);
  }

  async remove(params: FindOneCardItemDetailDto) {
    const cardItemDetail = await this.cardItemDetailsRepository.findOne({
      where: {
        cardItemDetailsId: params?.cardItemDetailsId,
        dmlStatus: Not(2),
      },
      relations: ['cardSummary'], // Ensure to load the related CardSummary
    });

    if (!cardItemDetail) {
      throw new NotFoundException(`Detail with ID ${params.cardItemDetailsId} not found or has been deleted`);
    }

    // Update the dmlStatus to 2 (deleted)
    cardItemDetail.dmlStatus = 2;
    await this.cardItemDetailsRepository.save(cardItemDetail);

    // Update the totalAmount in CardSummary
    const cardSummary = cardItemDetail.cardSummary;
    cardSummary.totalAmount -= cardItemDetail.totalAmount;
    await this.cardSummaryRepository.save(cardSummary);

      // Check if there are any active CardItemDetails left
      const activeItemsCount = await this.cardItemDetailsRepository.count({
        where: {
          cardSummary: cardSummary,
          dmlStatus: Not(2),
        },
      });
  
      // If no active items are left, remove the CardSummary
      if (activeItemsCount === 0) {
        cardSummary.dmlStatus = 2; // Mark as logically deleted
        await this.cardSummaryRepository.save(cardSummary);
      }

    return cardItemDetail;
}

}











  