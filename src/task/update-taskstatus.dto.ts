import { TaskStatus } from '@prisma/client';
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
