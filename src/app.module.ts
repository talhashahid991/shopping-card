import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CategoryModule } from './cart/category/category.module';
import { CartSummaryModule } from './cart/cart-summary/cart-summary.module';
import { CartItemDetailsModule } from './cart/cart-item-detail/cart-item-detail.module';
import { UserModule } from './cart/user/user.module';
import { ItemModule } from './cart/item/item.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
ConfigModule.forRoot(),
TypeOrmModule. forRootAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: (configService: ConfigService) => ({
type: 'postgres',
host: configService.get('DB_HOST'),
port: +configService.get('DB_PORT'),
username: configService.get('DB_USERNAME'),
password: configService.get('DB_PASSWORD'),
database: configService.get('DB_NAME'),
entities: [join (process. cwd (), 'dist/**/*.entity.js')],
// do NOT use synchronize: true in real projects
synchronize: true,
autoLoadEntities: true, //tables werent being created without using this!!
}),
}),
    
ItemModule,
CartItemDetailsModule,
CategoryModule,
CartSummaryModule,
UserModule,
AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
