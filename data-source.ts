import { Category } from 'src/card/category/entities/category.entity';
import { CardSummary } from 'src/card/card-summary/entities/card-summary.entity';
import { Item } from 'src/card/item/entities/item.entity';
import { User } from 'src/card/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { CardItemDetails } from 'src/card/card-item-detail/entities/card-item-detail.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'dev',
  password: 'secret',
  database: 'demo',
  entities: [User, Category, Item, CardSummary, CardItemDetails],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
