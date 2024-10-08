import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CategoryModule } from './card/category/category.module';
import { CardSummaryModule } from './card/card-summary/card-summary.module';
import { CardItemDetailsModule } from './card/card-item-detail/card-item-detail.module';
import { UserModule } from './card/user/user.module';
import { ItemModule } from './card/item/item.module';
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
CardItemDetailsModule,
CategoryModule,
CardSummaryModule,
UserModule,
AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
