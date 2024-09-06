import { PartialType } from '@nestjs/mapped-types';
import { CreateCardSummaryDto } from './create-card-summary.dto';

export class UpdateCardSummaryDto extends PartialType(CreateCardSummaryDto) {}
//this makes mapped type of create class which makes all create fields optional for updation
