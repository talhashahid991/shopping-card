import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  dml_status: number;

  @OneToMany(() => Item, item => item.category_id)
  items: Item[];
}