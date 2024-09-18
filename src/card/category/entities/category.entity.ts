import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Item } from '../../item/entities/item.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({name: 'category_id'})
  categoryId: number;

  @Column({name: 'title'})
  @IsNotEmpty()
  title: string;

  @Column({name: 'description'})
  @IsNotEmpty()
  description: string;

  @Column({name: 'dml_status'})
  @IsNotEmpty()
  dmlStatus: number;

  @OneToMany(() => Item, item => item.categoryId)
  items: Item[];
}