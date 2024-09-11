import { PartialType } from '@nestjs/mapped-types';
import { CreateCardItemDetailsDto } from './create-card-item-detail.dto';
import { IsNumber } from 'class-validator';

export class UpdateCardItemDetailsDto extends PartialType(CreateCardItemDetailsDto) {
    @IsNumber()
    card_item_details_id: number;
}
