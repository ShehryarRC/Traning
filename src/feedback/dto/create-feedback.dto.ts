import { IsString, IsNumber } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  comment: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  customerId: number;
}
