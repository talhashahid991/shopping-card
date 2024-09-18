import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


import { IsNotEmpty } from 'class-validator';
import { Category } from '../../category/entities/category.entity';
import { CardItemDetails } from '../../card-item-detail/entities/card-item-detail.entity';

@Entity()
export class Item {

  @PrimaryGeneratedColumn({name: 'item_id'})
  itemId: number;

  @Column({name: 'item_name'})
  @IsNotEmpty()
  itemName: string;

  @Column('decimal',{name: 'price'})
  @IsNotEmpty()
  price: number;

  @ManyToOne(() => Category, category => category.items)
  categoryId: Category;

  @Column({name: 'dml_status'})
  @IsNotEmpty()
  dmlStatus: number;

  @OneToMany(() => CardItemDetails, cardItemDetail => cardItemDetail.cardItemDetailsId)
  cardItemDetails: CardItemDetails[];

}