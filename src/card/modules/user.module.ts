import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { CardSummaryModule } from './card-summary.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => CardSummaryModule)], //circular dependency between user and card summary
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService] //circular dependency between user and card summary
})
export class UserModule {}
