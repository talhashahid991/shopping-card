import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardItemDetails } from './entities/card-item-detail.entity';
import { CardItemDetailsController } from './card-item-details.controller';
import { CardItemDetailsService } from './card-item-details.service';
import { CardSummaryModule } from '../card-summary/card-summary.module';
import { ItemModule } from '../item/item.module';



@Module({
  imports: [TypeOrmModule.forFeature([CardItemDetails]),CardSummaryModule,ItemModule],
  controllers: [CardItemDetailsController],
  providers: [CardItemDetailsService],
})
export class CardItemDetailsModule {}