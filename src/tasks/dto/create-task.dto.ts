import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsArray()
  @IsNumber({}, { each: true }) // Validate that each element is a number
  assigned_to: Array<number>;
}
