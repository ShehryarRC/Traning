import { IsEmail, IsString, IsOptional } from 'class-validator';
import { Feedback } from 'src/feedback/entities/feedback.entity';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  feedbacks?: Feedback[];
}
