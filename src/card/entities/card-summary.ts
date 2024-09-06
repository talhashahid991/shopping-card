import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CardItemDetails } from './card-item-detail.entity';
import { IsNotEmpty } from 'class-validator';


@Entity()
export class CardSummary {
  @PrimaryGeneratedColumn()
  card_summary_id: number;

  @Column()
  @IsNotEmpty()
  total_amount: number;

  
  @ManyToOne(() => User, user => user.shopKeeps)
  shop_keep_id: User;

  @ManyToOne(() => User, user => user.customers)
  customer_id: User

  @Column()
  @IsNotEmpty()
  sale_date: string;

  @Column()
  @IsNotEmpty()
  dml_status: number;

  @Column()
  @IsNotEmpty()
  sold_status: boolean;
  
  @OneToMany(() => CardItemDetails, cardItemDetails => cardItemDetails.card_summary)
  cardItemDetails: CardItemDetails[];
}

