import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
import { User, UserType } from '../user/entities/user.entity';
import { CreateCardSummaryDto } from './dto/create-card-summary.dto';
import { UpdateCardSummaryDto } from './dto/update-card-summary.dto';
import { CardSummary } from './entities/card-summary.entity';
import { FindOneCardSummaryDto } from './dto/findOne-card-summary.dto';

@Injectable()
export class CardSummaryService {
  constructor(
    @InjectRepository(CardSummary)
    private cardSummaryRepository: Repository<CardSummary>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCardSummaryDto: CreateCardSummaryDto): Promise<CardSummary> {
    const shopKeep = await this.userRepository.findOneBy({ userId: createCardSummaryDto.shopKeepId, userType: UserType.SHOP_KEEP });
    if (!shopKeep) {
      throw new NotFoundException('Shop keep not found');
    }

    const customer = await this.userRepository.findOneBy({ userId: createCardSummaryDto.customerId, userType: UserType.CUSTOMER });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const cardSummary = this.cardSummaryRepository.create({
      ...createCardSummaryDto,
      dmlStatus: 1, // Set dml_status to 1 for insert
      shopKeepId: shopKeep,
      customerId: customer,
    });

    return this.cardSummaryRepository.save(cardSummary);
  }

  findAll(): Promise<CardSummary[]> {
    return this.cardSummaryRepository.find({ where: { dmlStatus: Not(2) } });
  }

  async findOne(params: FindOneCardSummaryDto): Promise<CardSummary> {
    const category = await this.cardSummaryRepository.findOne({ 
      where : {cardSummaryId: params?.cardSummaryId}   
    });
    if (!category || category.dmlStatus === 2) {
      throw new NotFoundException(`Card summary with ID ${params.cardSummaryId} not found or has been deleted`);
    }
    return category;
  }

  async getSoldHistory(shopKeepId: number): Promise<CardSummary[]> {
    const shopKeep = await this.cardSummaryRepository.findOne({
      where: {
        shopKeepId: {
          userId: shopKeepId,
          userType: UserType.SHOP_KEEP
        }
      }
    });

    if (!shopKeep) {
      throw new NotFoundException(`No sales associated with Shopkeeper: ID ${shopKeepId} Or Shopkeeper not found`);
    }

    return this.cardSummaryRepository.createQueryBuilder('cardSummary')
      .innerJoinAndSelect('cardSummary.shopKeepId', 'user')
      .where('user.user_id = :shopKeepId', { shopKeepId })
      .andWhere('user.user_type = :userType', { userType: 'shopkeep' })
      .andWhere('cardSummary.sold_status = :soldStatus', { soldStatus: true })
      .getMany();
  }

  async update(updateCardSummaryDto: UpdateCardSummaryDto) {
    const cardSummary = await this.cardSummaryRepository.findOne({
      where: {
        cardSummaryId: updateCardSummaryDto?.cardSummaryId,
        dmlStatus: Not(2),
      },
    });
    if (!cardSummary || cardSummary.dmlStatus === 2) {
      throw new NotFoundException(`Card summary with ID ${updateCardSummaryDto.cardSummaryId} not found or has been deleted`);
    }  

    Object.assign(cardSummary, updateCardSummaryDto);
    cardSummary.dmlStatus = 3; // Set dml_status to 3 for update
    const res = await this.cardSummaryRepository.save(cardSummary);
    return await this.cardSummaryRepository.find({
      where: { cardSummaryId: res?.cardSummaryId },
    });
  }

  async remove(params: FindOneCardSummaryDto) {
    const res = await this.cardSummaryRepository.findOne({
      where: {
        cardSummaryId: params?.cardSummaryId,
        dmlStatus: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`Card Summary with ID ${params.cardSummaryId} not found or has been deleted`);
    }

    res.dmlStatus = 2; // Set dml_status to 2 for delete
    await this.cardSummaryRepository.save(res);  
    return this.cardSummaryRepository.find({ where: { dmlStatus: Not(2) } });
  }
}
