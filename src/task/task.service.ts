import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskStatusDto } from './update-taskstatus.dto';

import { TaskInvalidStatusException } from 'src/exceptions/task-invalid-status.exception';
import { isUUID } from 'class-validator';
import { TaskIdInvalidException } from 'src/exceptions/task-id-invalid.exception';
import { CustomLogger } from 'src/common/logger/custom-logger/custom-logger';
import { ApiResponse } from 'src/common/utils/response.util';

@Injectable()
export class TaskService {
  constructor(
    private prismaService: PrismaService,
    private readonly logger: CustomLogger,
  ) {}

  // Only return tasks for the logged-in user
  async getAllTasks(userId: string) {
    try {
      return await this.prismaService.task.findMany({
        where: { userId }, // <-- filter by user
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      return ApiResponse.error('Task not created', HttpStatus.BAD_REQUEST);
    }
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId }, // <-- ensure user owns this task
    });
    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    if (!isUUID(id)) {
      throw new TaskIdInvalidException(id);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    if (!createTaskDto.title || createTaskDto.title.trim() === '') {
      throw new BadRequestException('title is required');
    }

    const status = createTaskDto.status || TaskStatus.OPEN;

    return this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description || '',
        status,
        user: { connect: { id: userId } }, // <-- link task to user
      },
    });
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskStatusDto,
    userId: string,
  ) {
    // Ensure only the task owner can update
    const existingTask = await this.prismaService.task.findFirst({
      where: { id, userId },
    });
    if (!existingTask) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    const { title, description, status } = updateTaskDto;

    if (
      status &&
      ![TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE].includes(
        status,
      )
    ) {
      throw new TaskInvalidStatusException(status);
    }

    return this.prismaService.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });
  }

  async deleteTask(id: string, userId: string) {
    // Ensure only the task owner can delete
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return this.prismaService.task.delete({ where: { id } });
  }
}
