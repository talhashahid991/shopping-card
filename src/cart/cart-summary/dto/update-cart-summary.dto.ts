import { PartialType } from '@nestjs/mapped-types';
import { CreateCartSummaryDto } from './create-cart-summary.dto';
import { IsNumber } from 'class-validator';


export class UpdateCartSummaryDto extends PartialType(CreateCartSummaryDto) {
    @IsNumber()
    cartSummaryId: number;
}
//this makes mapped type of create class which makes all create fields optional for updation
