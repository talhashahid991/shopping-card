import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Item } from '../../item/entities/item.entity';
import { CartSummary } from '../../cart-summary/entities/cart-summary.entity';
import { IsNotEmpty } from 'class-validator';


@Entity()
export class CartItemDetails {
  @PrimaryGeneratedColumn({name: 'cart_item_details_id'})
  cartItemDetailsId: number;

  @ManyToOne(() => CartSummary, cartSummary => cartSummary.cartItemDetails)
  cartSummary: CartSummary;

  @ManyToOne(() => Item, item => item.cartItemDetails)
  item: Item;

  @Column({name: 'total_Amount'})
  totalAmount: number;

  @Column({name: 'quantity'})
  @IsNotEmpty()
  quantity: number;

  @Column({name: 'dml_status'})
  dmlStatus: number;
}
