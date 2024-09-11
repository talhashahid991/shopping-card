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
    const shopKeep = await this.userRepository.findOneBy({ user_id: createCardSummaryDto.shop_keep_id, user_type: UserType.SHOP_KEEP });
    if (!shopKeep) {
      throw new NotFoundException('Shop keep not found');
    }

    const customer = await this.userRepository.findOneBy({ user_id: createCardSummaryDto.customer_id, user_type: UserType.CUSTOMER });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const cardSummary = this.cardSummaryRepository.create({
      ...createCardSummaryDto,
      dml_status: 1, // Set dml_status to 1 for insert
      shop_keep_id: shopKeep,
      customer_id: customer,
    });

    return this.cardSummaryRepository.save(cardSummary);
  }

  findAll(): Promise<CardSummary[]> {
    return this.cardSummaryRepository.find({ where: { dml_status: Not(2) } });
  }

  async findOne(params: FindOneCardSummaryDto): Promise<CardSummary> {
    const category = await this.cardSummaryRepository.findOne({ 
      where : {card_summary_id: params?.card_summary_id}   
    });
    if (!category || category.dml_status === 2) {
      throw new NotFoundException(`Card summary with ID ${params.card_summary_id} not found or has been deleted`);
    }
    return category;
  }

  async getSoldHistory(shopKeepId: number): Promise<CardSummary[]> {
    return this.cardSummaryRepository.createQueryBuilder('cardSummary')
      .innerJoinAndSelect('cardSummary.shop_keep_id', 'user')
      .where('user.user_id = :shopKeepId', { shopKeepId })
      .andWhere('user.user_type = :userType', { userType: 'shopkeep' })
      .andWhere('cardSummary.sold_status = :soldStatus', { soldStatus: true })
      .getMany();
  }

  async update(updateCardSummaryDto: UpdateCardSummaryDto) {
    const cardSummary = await this.cardSummaryRepository.findOne({
      where: {
        card_summary_id: updateCardSummaryDto?.card_summary_id,
        dml_status: Not(2),
      },
    });
    if (!cardSummary || cardSummary.dml_status === 2) {
      throw new NotFoundException(`Card summary with ID ${updateCardSummaryDto.card_summary_id} not found or has been deleted`);
    }  

    Object.assign(cardSummary, updateCardSummaryDto);
    cardSummary.dml_status = 3; // Set dml_status to 3 for update
    const res = await this.cardSummaryRepository.save(cardSummary);
    return await this.cardSummaryRepository.find({
      where: { card_summary_id: res?.card_summary_id },
    });
  }

  async remove(params: FindOneCardSummaryDto) {
    const res = await this.cardSummaryRepository.findOne({
      where: {
        card_summary_id: params?.card_summary_id,
        dml_status: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`Card Summary with ID ${params.card_summary_id} not found or has been deleted`);
    }

    res.dml_status = 2; // Set dml_status to 2 for delete
    await this.cardSummaryRepository.save(res);  
  }
}
