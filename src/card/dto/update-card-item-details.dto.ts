import { PartialType } from '@nestjs/mapped-types';
import { CreateCardItemDetailsDto } from './create-card-item-detail.dto';

export class UpdateCardItemDetailsDto extends PartialType(CreateCardItemDetailsDto) {}
