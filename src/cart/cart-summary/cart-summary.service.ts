import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not, Like,Equal } from 'typeorm';
import { User, UserType } from '../user/entities/user.entity';
import { CreateCartSummaryDto } from './dto/create-cart-summary.dto';
import { UpdateCartSummaryDto } from './dto/update-cart-summary.dto';
import { CartSummary } from './entities/cart-summary.entity';
import { FindOneCartSummaryDto } from './dto/findOne-cart-summary.dto';
import { FindAllCartSummaryDto } from './dto/findAll-cart-summary.dto';

@Injectable()
export class CartSummaryService {
  constructor(
    @InjectRepository(CartSummary)
    private cartSummaryRepository: Repository<CartSummary>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCartSummaryDto: CreateCartSummaryDto): Promise<CartSummary> {
    //confusion can occur here because shopkeep n customer ids are being passed as types of userRepository directly to 
    //cartSummaryRepository. Type numbers for these id's in createCartSummary are only being used as input comparison 
    //for searching the existence of user type
    const shopKeep = await this.userRepository.findOneBy({ userId: createCartSummaryDto.shopKeepId, userType: UserType.SHOP_KEEP });
    if (!shopKeep) {
      throw new NotFoundException('Shop keep not found');
    }

    const customer = await this.userRepository.findOneBy({ userId: createCartSummaryDto.customerId, userType: UserType.CUSTOMER });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const cartSummary = this.cartSummaryRepository.create({
      ...createCartSummaryDto,
      dmlStatus: 1, // Set dml_status to 1 for insert
      shopKeepId: shopKeep,
      customerId: customer,
      saleDate: new Date().toISOString(),
    });

    return this.cartSummaryRepository.save(cartSummary);
  }

  async findAll(findAllCartSummaryDto:FindAllCartSummaryDto): Promise<{ data: CartSummary[], count: number }> {
    const page = findAllCartSummaryDto.page;
    const limit = findAllCartSummaryDto.limit;
    const { totalAmount, shopKeepId, customerId, soldStatus } = findAllCartSummaryDto;
    const offset = (page - 1) * limit;
    const [data, count] = await this.cartSummaryRepository.findAndCount({
      where: { dmlStatus: Not(2),
        ...(totalAmount && { totalAmount: Equal(totalAmount) }),
        ...(customerId && { customerId: Equal(customerId) }),
        ...(shopKeepId && { shopKeepId: Equal(shopKeepId) }),
        ...(soldStatus /*!== undefined*/ && { soldStatus: Equal(soldStatus)})
       },
      relations: ['shopKeepId','customerId','cartItemDetails'],
      skip: offset,
      take: limit,
    });
    if(data.length <= 0){
      throw new NotFoundException('No records found.');
    }
    return { data, count };
  }
      

  async findOne(params: FindOneCartSummaryDto): Promise<CartSummary> {
    const category = await this.cartSummaryRepository.findOne({ 
      where : {cartSummaryId: params?.cartSummaryId},
    relations: ['shopKeepId','customerId','cartItemDetails']   
    });
    if (!category || category.dmlStatus === 2) {
      throw new NotFoundException(`Cart summary with ID ${params.cartSummaryId} not found or has been deleted`);
    }
    return category;
  }

  async getSoldHistory(shopKeepId: number): Promise<CartSummary[]> {
    const shopKeep = await this.cartSummaryRepository.findOne({
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

    return this.cartSummaryRepository.createQueryBuilder('cartSummary')
      .innerJoinAndSelect('cartSummary.shopKeepId', 'user')
      .where('user.user_id = :shopKeepId', { shopKeepId })
      .andWhere('user.user_type = :userType', { userType: 'shopkeep' })
      .andWhere('cartSummary.sold_status = :soldStatus', { soldStatus: true })
      .getMany();
  }

  async update(updateCartSummaryDto: UpdateCartSummaryDto) {
    const cartSummary = await this.cartSummaryRepository.findOne({
      where: {
        cartSummaryId: updateCartSummaryDto?.cartSummaryId,
        dmlStatus: Not(2),
      },
    });
    if (!cartSummary || cartSummary.dmlStatus === 2) {
      throw new NotFoundException(`Cart summary with ID ${updateCartSummaryDto.cartSummaryId} not found or has been deleted`);
    }  

    Object.assign(cartSummary, updateCartSummaryDto);
    cartSummary.dmlStatus = 3; // Set dml_status to 3 for update
    const res = await this.cartSummaryRepository.save(cartSummary);
    return await this.cartSummaryRepository.find({
      where: { cartSummaryId: res?.cartSummaryId },
    });
  }

  async remove(params: FindOneCartSummaryDto) {
    const res = await this.cartSummaryRepository.findOne({
      where: {
        cartSummaryId: params?.cartSummaryId,
        dmlStatus: Not(2),
      },
    });

    if (!res) {
      throw new NotFoundException(`Cart Summary with ID ${params.cartSummaryId} not found or has been deleted`);
    }

    res.dmlStatus = 2; // Set dml_status to 2 for delete
    await this.cartSummaryRepository.save(res);  
  }
}
