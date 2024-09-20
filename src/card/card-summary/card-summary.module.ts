import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardSummary } from './entities/card-summary.entity';
import { CardSummaryController } from './card-summary.controller';
import { CardSummaryService } from './card-summary.service';
import { UserModule } from '../user/user.module';


@Module({
  imports: [TypeOrmModule.forFeature([CardSummary]), forwardRef(() => UserModule)], //circular dependency between user and card summary
  controllers: [CardSummaryController],
  providers: [CardSummaryService],
  exports:[TypeOrmModule, CardSummaryService] //circular dependency between user and card summary
})
export class CardSummaryModule {}
