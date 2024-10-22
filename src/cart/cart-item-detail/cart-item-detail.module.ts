import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemDetails } from './entities/cart-item-detail.entity';
import { CartItemDetailsController } from './cart-item-details.controller';
import { CartItemDetailsService } from './cart-item-details.service';
import { CartSummaryModule } from '../cart-summary/cart-summary.module';
import { ItemModule } from '../item/item.module';
import { UserModule } from '../user/user.module';



@Module({
  imports: [TypeOrmModule.forFeature([CartItemDetails]),CartSummaryModule,ItemModule,UserModule],
  controllers: [CartItemDetailsController],
  providers: [CartItemDetailsService],
})
export class CartItemDetailsModule {}