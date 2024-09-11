import { PartialType } from '@nestjs/mapped-types';
import { CreateCardSummaryDto } from './create-card-summary.dto';
import { IsNumber } from 'class-validator';


export class UpdateCardSummaryDto extends PartialType(CreateCardSummaryDto) {
    @IsNumber()
    card_summary_id: number;
}
//this makes mapped type of create class which makes all create fields optional for updation
