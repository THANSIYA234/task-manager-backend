import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title for task' })
  title: string;

  @ApiProperty({ description: 'description for task', required: false })
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'status of the task',
    enum: TaskStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
