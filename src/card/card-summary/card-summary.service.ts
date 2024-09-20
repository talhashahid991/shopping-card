import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not, Like,Equal } from 'typeorm';
import { User, UserType } from '../user/entities/user.entity';
import { CreateCardSummaryDto } from './dto/create-card-summary.dto';
import { UpdateCardSummaryDto } from './dto/update-card-summary.dto';
import { CardSummary } from './entities/card-summary.entity';
import { FindOneCardSummaryDto } from './dto/findOne-card-summary.dto';
import { FindAllCardSummaryDto } from './dto/findAll-card-summary.dto';

@Injectable()
export class CardSummaryService {
  constructor(
    @InjectRepository(CardSummary)
    private cardSummaryRepository: Repository<CardSummary>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCardSummaryDto: CreateCardSummaryDto): Promise<CardSummary> {
    //confusion can occur here because shopkeep n customer ids are being passed as types of userRepository directly to 
    //cardSummaryRepository. Type numbers for these id's in createCardSummary are only being used as input comparison 
    //for searching the existence of user type
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
      saleDate: new Date().toISOString(),
    });

    return this.cardSummaryRepository.save(cardSummary);
  }

  async findAll(findAllCardSummaryDto:FindAllCardSummaryDto): Promise<{ data: CardSummary[], count: number }> {
    const page = findAllCardSummaryDto.page;
    const limit = findAllCardSummaryDto.limit;
    const { totalAmount, shopKeepId, customerId, soldStatus } = findAllCardSummaryDto;
    const offset = (page - 1) * limit;
    const [data, count] = await this.cardSummaryRepository.findAndCount({
      where: { dmlStatus: Not(2),
        ...(totalAmount && { totalAmount: Equal(totalAmount) }),
        ...(customerId && { customerId: Equal(customerId) }),
        ...(shopKeepId && { shopKeepId: Equal(shopKeepId) }),
        ...(soldStatus /*!== undefined*/ && { soldStatus: Equal(soldStatus)})
       },
      relations: ['shopKeepId','customerId','cardItemDetails'],
      skip: offset,
      take: limit,
    });
    if(data.length <= 0){
      throw new NotFoundException('No records found.');
    }
    return { data, count };
  }
      

  async findOne(params: FindOneCardSummaryDto): Promise<CardSummary> {
    const category = await this.cardSummaryRepository.findOne({ 
      where : {cardSummaryId: params?.cardSummaryId},
    relations: ['shopKeepId','customerId','cardItemDetails']   
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
  }
}
