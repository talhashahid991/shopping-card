import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CardSummary } from '../../card-summary/entities/card-summary.entity';
import { Item } from '../../item/entities/item.entity';
import { IsNotEmpty } from 'class-validator';


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

  @Column()
  dml_status: number;
}
