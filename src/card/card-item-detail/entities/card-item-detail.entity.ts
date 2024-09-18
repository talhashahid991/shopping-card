import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { CardSummary } from '../../card-summary/entities/card-summary.entity';
import { IsNotEmpty } from 'class-validator';


@Entity()
export class CardItemDetails {
  @PrimaryGeneratedColumn({name: 'card_item_details_id'})
  cardItemDetailsId: number;

  @ManyToOne(() => CardSummary, cardSummary => cardSummary.cardItemDetails)
  cardSummary: CardSummary;

  @ManyToOne(() => Item, item => item.cardItemDetails)
  item: Item;

  @Column({name: 'total_Amount'})
  totalAmount: number;

  @Column({name: 'quantity'})
  @IsNotEmpty()
  quantity: number;

  @Column({name: 'dml_status'})
  dmlStatus: number;
}
