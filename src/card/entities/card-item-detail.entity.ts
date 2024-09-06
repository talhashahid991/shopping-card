import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CardSummary } from './card-summary';
import { Item } from './item.entity';


@Entity()
export class CardItemDetails {
  @PrimaryGeneratedColumn()
  card_item_details_id: number;

  @ManyToOne(() => CardSummary, cardSummary => cardSummary.cardItemDetails)
  card_summary: CardSummary;

  @ManyToOne(() => Item, item => item.card_item_details)
  item: Item;

  @Column()
  item_price: number;

  @Column()
  quantity: number;
}
