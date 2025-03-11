import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  title?: string | undefined;

  @IsString()
  description?: string | undefined;

  @IsOptional()
  @IsString()
  status?: string | undefined;

  @IsArray()
  @IsNumber({}, { each: true })
  assigned_to?: number[] | undefined;
}
