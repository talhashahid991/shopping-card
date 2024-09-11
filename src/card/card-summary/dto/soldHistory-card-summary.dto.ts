import { IsNumber } from 'class-validator'; 

export class GetSoldHistoryDto { 
  @IsNumber() 
  shopKeepId: number; 
} 