import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

import { CardItemDetails } from '../../card-item-detail/entities/card-item-detail.entity';
import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/card/category/entities/category.entity';

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