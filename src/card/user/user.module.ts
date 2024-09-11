import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';
import { CardSummaryModule } from '../card-summary/card-summary.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => CardSummaryModule)], //circular dependency between user and card summary
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService] //circular dependency between user and card summary
})
export class UserModule {}
