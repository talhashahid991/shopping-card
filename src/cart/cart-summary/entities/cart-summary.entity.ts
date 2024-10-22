import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CartItemDetails } from '../../cart-item-detail/entities/cart-item-detail.entity';
import { IsNotEmpty } from 'class-validator';


@Entity()
export class CartSummary {
  @PrimaryGeneratedColumn({name: 'cart_summary_id'})
  cartSummaryId: number;

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
  
  @OneToMany(() => CartItemDetails, cartItemDetails => cartItemDetails.cartSummary)
  cartItemDetails: CartItemDetails[];
}

