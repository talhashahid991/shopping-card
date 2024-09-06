import { CardItemDetails } from 'src/card/entities/card-item-detail.entity';
import { CardSummary } from 'src/card/entities/card-summary';
import { Category } from 'src/card/entities/category.entity';
import { Item } from 'src/card/entities/item.entity';
import { User } from 'src/card/entities/user.entity';
import { DataSource } from 'typeorm';


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
