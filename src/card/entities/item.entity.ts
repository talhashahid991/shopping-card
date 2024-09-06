import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { CardItemDetails } from './card-item-detail.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  @IsNotEmpty()
  item_name: string;

  @Column('decimal')
  @IsNotEmpty()
  price: number;

  @ManyToOne(() => Category, category => category.items)
  category_id: Category;

  @Column()
  @IsNotEmpty()
  dml_status: number;

  @OneToMany(() => CardItemDetails, cardItemDetail => cardItemDetail.card_item_details_id)
  card_item_details: CardItemDetails[];

}