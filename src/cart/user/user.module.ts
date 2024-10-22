import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';
import { CartSummaryModule } from '../cart-summary/cart-summary.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => CartSummaryModule)], //circular dependency between user and cart summary
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService] //circular dependency between user and cart summary
})
export class UserModule {}
