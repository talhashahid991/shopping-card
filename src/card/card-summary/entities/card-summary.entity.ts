import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CardItemDetails } from '../../card-item-detail/entities/card-item-detail.entity';
import { IsNotEmpty } from 'class-validator';


@Entity()
export class CardSummary {
  @PrimaryGeneratedColumn({name: 'card_summary_id'})
  cardSummaryId: number;

  @Column({name: 'total_amount'})
  totalAmount: number;

  @ManyToOne(() => User, user => user.shopKeeps)
  shopKeepId: User;

  @ManyToOne(() => User, user => user.customers)
  customerId: User

  @Column({name: 'sale_date'})
  @IsNotEmpty()
  saleDate: string;

  @Column({name: 'dml_status'})
  @IsNotEmpty()
  dmlStatus: number;

  @Column({name: 'sold_status'})
  @IsNotEmpty()
  soldStatus: boolean;
  
  @OneToMany(() => CardItemDetails, cardItemDetails => cardItemDetails.cardSummary)
  cardItemDetails: CardItemDetails[];
}

