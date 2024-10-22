import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDetailsDto } from './create-cart-item-detail.dto';
import { IsNumber } from 'class-validator';

export class UpdateCartItemDetailsDto extends PartialType(CreateCartItemDetailsDto) {
    @IsNumber()
    cartItemDetailsId: number;
}
