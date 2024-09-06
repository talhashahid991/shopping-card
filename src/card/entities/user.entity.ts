import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, Matches, Length } from 'class-validator';
import { CardSummary } from './card-summary';


export enum UserType {
  SHOP_KEEP = 'shopkeep',
  CUSTOMER = 'customer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Column()
  @IsNotEmpty()
  @Length(6, 12)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/, {
    message: 'Password must be 6-12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @Column()
  @IsEnum(UserType)
  user_type: UserType;

  @Column()
  @IsNotEmpty()
  dml_status: number;

  @OneToMany(() => CardSummary, cardSummary => cardSummary.shop_keep_id)
  shopKeeps: CardSummary[];

  @OneToMany(() => CardSummary, cardSummary => cardSummary.customer_id)
  customers: CardSummary[];

  // @BeforeRemove()
  // async checkForSales() {
  //   const cardSummaryService = new CardSummaryService();
  //   const sales = await cardSummaryService.findSalesByUserId(this.user_id);
  //   if (sales.length > 0) {
  //     throw new Error('User cannot be deleted as there are sales associated with this user.');
  //   }
  // }
}

