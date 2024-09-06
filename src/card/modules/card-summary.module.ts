// src/card-summary/card-summary.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardSummary } from '../entities/card-summary';
import { CardSummaryController } from '../controllers/card-summary.controller';
import { CardSummaryService } from '../services/card-summary.service';
import { UserModule } from './user.module';


@Module({
  imports: [TypeOrmModule.forFeature([CardSummary]), forwardRef(() => UserModule)], //circular dependency between user and card summary
  controllers: [CardSummaryController],
  providers: [CardSummaryService],
  exports:[TypeOrmModule, CardSummaryService] //circular dependency between user and card summary
})
export class CardSummaryModule {}
