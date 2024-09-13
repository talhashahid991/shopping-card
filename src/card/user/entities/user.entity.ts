import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, Matches, Length } from 'class-validator';
import { CardSummary } from '../../card-summary/entities/card-summary.entity';


export enum UserType {
  SHOP_KEEP = 'shopkeep',
  CUSTOMER = 'customer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({name: 'user_id'})
  userId: number;

  @Column({name: 'name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({name: 'username'})
  @IsNotEmpty()
  @IsString()
  username: string;

  @Column({name: 'password'})
  @IsNotEmpty()
  @Length(6, 12)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/, {
    message: 'Password must be 6-12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @Column({name: 'user_type'})
  @IsEnum(UserType)
  userType: UserType;

  @Column({name: 'dml_status'})
  @IsNotEmpty()
  dmlStatus: number;

  @OneToMany(() => CardSummary, cardSummary => cardSummary.shopKeepId)
  shopKeeps: CardSummary[];

  @OneToMany(() => CardSummary, cardSummary => cardSummary.customerId)
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

