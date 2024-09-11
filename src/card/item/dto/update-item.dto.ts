import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { IsNumber } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
@IsNumber()
item_id: number;
}
