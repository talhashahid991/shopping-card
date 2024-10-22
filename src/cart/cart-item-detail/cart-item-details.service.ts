import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not,Equal } from 'typeorm';
import { CartItemDetails } from './entities/cart-item-detail.entity';
import { CartSummary } from '../cart-summary/entities/cart-summary.entity';
import { Item } from '../item/entities/item.entity';
import { CreateCartItemDetailsDto } from './dto/create-cart-item-detail.dto';
import { UpdateCartItemDetailsDto } from './dto/update-cart-item-details.dto';
import { FindOneCartItemDetailDto } from './dto/findOne-cart-item-detail.dto';
import { User, UserType } from '../user/entities/user.entity';
import { FindAllCartItemDetailsDto } from './dto/findAll-cart-item-detail.dto';


@Injectable()
export class CartItemDetailsService {
  constructor(
    @InjectRepository(CartItemDetails)
    private cartItemDetailsRepository: Repository<CartItemDetails>,
    @InjectRepository(CartSummary)
    private cartSummaryRepository: Repository<CartSummary>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createcartItemDetailDto: CreateCartItemDetailsDto): Promise<CartItemDetails> {
    let cartSummary: CartSummary;

    if (createcartItemDetailDto.cartSummaryId) {
      // Find the existing CartSummary
      cartSummary = await this.cartSummaryRepository.findOne({
        where: { cartSummaryId: createcartItemDetailDto.cartSummaryId },
      });

      if (!cartSummary || cartSummary.soldStatus === true) {
        throw new Error(`CartSummary with ID ${createcartItemDetailDto.cartSummaryId} not found`);
      }
    } else {
      // Create a new CartSummary
      
    //confusion can occur here because shopkeep n customer ids are being passed as types of userRepository directly to 
    //cartSummaryRepository. Type numbers for these id's in createcartItemDetailDto are only being used as input comparison 
    //for searching the existence of user type
    const shopKeep = await this.userRepository.findOneBy({ userId: createcartItemDetailDto.shopKeepId, userType: UserType.SHOP_KEEP });
    if (!shopKeep) {
      throw new NotFoundException('Shop keep not found');
    }

    const customer = await this.userRepository.findOneBy({ userId: createcartItemDetailDto.customerId, userType: UserType.CUSTOMER });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

      cartSummary = this.cartSummaryRepository.create({
        totalAmount: 0, //initial amount is 0
        shopKeepId: shopKeep,
        customerId: customer,
        saleDate: new Date().toISOString(),
        dmlStatus: 1, // Assuming 1 means "insert"
        soldStatus: false, // Assuming initial sold status is false
      });
      await this.cartSummaryRepository.save(cartSummary);
    }

    // fetch the item and its price for CartItemDetail
    const item = await this.itemRepository.findOneBy({ itemId: createcartItemDetailDto.itemId });
       if (!item) {
         throw new NotFoundException('Item not found');
       }

    // Calculate the total amount for the CartItemDetail
    const totalAmount = item.price * createcartItemDetailDto.quantity;

    const cartItemDetail = this.cartItemDetailsRepository.create({
      cartSummary: cartSummary,
      item: item,
      quantity: createcartItemDetailDto.quantity,
      totalAmount: totalAmount,
      dmlStatus: 1,
    });
    await this.cartItemDetailsRepository.save(cartItemDetail);

    // Update the total amount in CartSummary
    cartSummary.totalAmount += cartItemDetail.totalAmount;
    await this.cartSummaryRepository.save(cartSummary);

    return cartItemDetail;
  }

  async findAll(findAllCartItemDetailsDto:FindAllCartItemDetailsDto): Promise<{ data: CartItemDetails[], count: number }> {
    const page = findAllCartItemDetailsDto.page;
    const limit = findAllCartItemDetailsDto.limit;
    const { cartSummaryId, shopKeepId, customerId, itemId, totalAmount, quantity } = findAllCartItemDetailsDto;
    const offset = (page - 1) * limit;
    const [data, count] = await this.cartItemDetailsRepository.findAndCount({
      where: { dmlStatus: Not(2),
        ...(cartSummaryId && { cartSummary: Equal(cartSummaryId) }),
        ...(itemId && { item: Equal(itemId) }),
        ...(totalAmount && { totalAmount: Equal(totalAmount) }),
        ...(quantity && { quantity: Equal(quantity) }),
       },
      relations: ['item','cartSummary'],
      skip: offset,
      take: limit,
    });
    if(data.length <= 0){
      throw new NotFoundException('No records found.');
    }
    return { data, count };
  } 
      


  async findOne(params: FindOneCartItemDetailDto): Promise<CartItemDetails> {
    const category = await this.cartItemDetailsRepository.findOne({ 
      where : {cartItemDetailsId: params?.cartItemDetailsId},
      relations: ['item','cartSummary']  
    });
    if (!category || category.dmlStatus === 2) {
      throw new NotFoundException(`Detail with ID ${params.cartItemDetailsId} not found or has been deleted`);
    }
    return category;
  }

  async update(updatecartItemDetailsDto: UpdateCartItemDetailsDto): Promise<CartItemDetails> {
    const cartItemDetails = await this.cartItemDetailsRepository.findOne({
      where: {
        cartItemDetailsId: updatecartItemDetailsDto?.cartItemDetailsId,
        dmlStatus: Not(2),
      },
    });
    if (!cartItemDetails) {
      throw new NotFoundException('cart item details not found');
    }

    const cartSummary = await this.cartSummaryRepository.findOne({
      where: { cartSummaryId: updatecartItemDetailsDto.cartSummaryId },
    });

    if (!cartSummary) {
      throw new NotFoundException(`CartSummary with ID ${updatecartItemDetailsDto.cartSummaryId} not found`);
    }

    let item = cartItemDetails.item;
    if (updatecartItemDetailsDto.itemId) {
      item = await this.itemRepository.findOneBy({ itemId: updatecartItemDetailsDto.itemId });
      if (!item) {
        throw new NotFoundException('Item not found');
      }
      cartItemDetails.item = item;
    }

    // Calculate the difference in total amount
    const oldTotalAmount = cartItemDetails.totalAmount;
    const newTotalAmount = item.price * updatecartItemDetailsDto.quantity;
    const amountDifference = newTotalAmount - oldTotalAmount;

    // Update the CartItemDetails
    Object.assign(cartItemDetails, updatecartItemDetailsDto);
    cartItemDetails.totalAmount = newTotalAmount;
    cartItemDetails.dmlStatus = 3;
    await this.cartItemDetailsRepository.save(cartItemDetails);

    // Update the total amount in CartSummary
    cartSummary.totalAmount += amountDifference;
    await this.cartSummaryRepository.save(cartSummary);
    
    return this.cartItemDetailsRepository.save(cartItemDetails);
  }

  async remove(params: FindOneCartItemDetailDto) {
    const cartItemDetail = await this.cartItemDetailsRepository.findOne({
      where: {
        cartItemDetailsId: params?.cartItemDetailsId,
        dmlStatus: Not(2),
      },
      relations: ['cartSummary'], // Ensure to load the related CartSummary
    });

    if (!cartItemDetail) {
      throw new NotFoundException(`Detail with ID ${params.cartItemDetailsId} not found or has been deleted`);
    }

    // Update the dmlStatus to 2 (deleted)
    cartItemDetail.dmlStatus = 2;
    await this.cartItemDetailsRepository.save(cartItemDetail);

    // Update the totalAmount in CartSummary
    const cartSummary = cartItemDetail.cartSummary;
    cartSummary.totalAmount -= cartItemDetail.totalAmount;
    await this.cartSummaryRepository.save(cartSummary);

      // Check if there are any active CartItemDetails left
      const activeItemsCount = await this.cartItemDetailsRepository.count({
        where: {
          cartSummary: cartSummary,
          dmlStatus: Not(2),
        },
      });
  
      // If no active items are left, remove the CartSummary
      if (activeItemsCount === 0) {
        cartSummary.dmlStatus = 2; // Mark as logically deleted
        await this.cartSummaryRepository.save(cartSummary);
      }

    return cartItemDetail;
}

}











  