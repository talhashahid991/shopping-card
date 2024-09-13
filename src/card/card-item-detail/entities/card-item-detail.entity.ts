import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CardSummary } from '../../card-summary/entities/card-summary.entity';
import { Item } from '../../item/entities/item.entity';
import { IsNotEmpty } from 'class-validator';


@Entity()
export class CardItemDetails {
  @PrimaryGeneratedColumn({name: 'card_item_details_id'})
  cardItemDetailsId: number;

  @ManyToOne(() => CardSummary, cardSummary => cardSummary.cardItemDetails)
  cardSummary: CardSummary;

  @ManyToOne(() => Item, item => item.cardItemDetails)
  item: Item;

  @Column({name: 'item_price'})
  itemPrice: number;

  @Column({name: 'quantity'})
  quantity: number;

  @Column({name: 'dml_status'})
  dmlStatus: number;
}
