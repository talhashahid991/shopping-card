import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
import { User, UserType } from '../entities/user.entity';
import { CreateCardSummaryDto } from '../dto/create-card-summary.dto';
import { UpdateCardSummaryDto } from '../dto/update-card-summary.dto';
import { CardSummary } from '../entities/card-summary';

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

  async findOne(id: number): Promise<CardSummary> {
    const cardSummary = await this.cardSummaryRepository.findOneBy({ card_summary_id: id });
    if (!cardSummary || cardSummary.dml_status === 2) {
      throw new NotFoundException(`Card Summary with ID ${id} not found or has been deleted`);
    }
    return cardSummary;
  }

  async getSoldHistory(shopKeepId: number): Promise<CardSummary[]> {
    return this.cardSummaryRepository.createQueryBuilder('cardSummary')
      .innerJoinAndSelect('cardSummary.shop_keep_id', 'user')
      .where('user.user_id = :shopKeepId', { shopKeepId })
      .andWhere('user.user_type = :userType', { userType: 'shopkeep' })
      .andWhere('cardSummary.sold_status = :soldStatus', { soldStatus: true })
      .getMany();
  }

  async update(id: number, updateCardSummaryDto: UpdateCardSummaryDto): Promise<CardSummary> {
    const cardSummary = await this.findOne(id);
    if (cardSummary.dml_status === 2) {
      throw new BadRequestException(`Card Summary with ID ${id} cannot be updated`);
    }

    if (updateCardSummaryDto.shop_keep_id) {
      const shopKeep = await this.userRepository.findOneBy({ user_id: updateCardSummaryDto.shop_keep_id, user_type: UserType.SHOP_KEEP });
      if (!shopKeep) {
        throw new NotFoundException('Shop keep not found');
      }
      cardSummary.shop_keep_id = shopKeep;
    }

    if (updateCardSummaryDto.customer_id) {
      const customer = await this.userRepository.findOneBy({ user_id: updateCardSummaryDto.customer_id, user_type: UserType.CUSTOMER });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      cardSummary.customer_id = customer;
    }

    Object.assign(cardSummary, updateCardSummaryDto);
    cardSummary.dml_status = 3; // Set dml_status to 3 for update
    return this.cardSummaryRepository.save(cardSummary);
  }

  async remove(id: number): Promise<void> {
    const cardSummary = await this.findOne(id);
    if (cardSummary.dml_status === 2) {
      throw new BadRequestException(`Card Summary with ID ${id} cannot be deleted`);
    }

    cardSummary.dml_status = 2; // Set dml_status to 2 for delete
    await this.cardSummaryRepository.save(cardSummary);
  }
}
