import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartSummary } from './entities/cart-summary.entity';
import { CartSummaryController } from './cart-summary.controller';
import { CartSummaryService } from './cart-summary.service';
import { UserModule } from '../user/user.module';


@Module({
  imports: [TypeOrmModule.forFeature([CartSummary]), forwardRef(() => UserModule)], //circular dependency between user and cart summary
  controllers: [CartSummaryController],
  providers: [CartSummaryService],
  exports:[TypeOrmModule, CartSummaryService] //circular dependency between user and cart summary
})
export class CartSummaryModule {}
