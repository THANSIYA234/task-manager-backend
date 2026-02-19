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

  async getAllTasks() {
    try {
      return await this.prismaService.task.findMany();
    } catch (error) {
      return ApiResponse.error('Task not created', HttpStatus.BAD_REQUEST);
    }
  }

  async getTaskById(id: string) {
    const task = await this.prismaService.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    if (!isUUID(id)) {
      throw new TaskIdInvalidException(id);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    // Validate title
    if (!createTaskDto.title || createTaskDto.title.trim() === '') {
      throw new BadRequestException('title is required');
    }

    // Set default status if none provided
    const status = createTaskDto.status || TaskStatus.OPEN;

    const data = {
      title: createTaskDto.title,
      description: createTaskDto.description || '',
      status,
      user: {
        connect: { id: userId },
      },
    };

    return this.prismaService.task.create({ data });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskStatusDto) {
    const { title, description, status } = updateTaskDto;

    let normalizedStatus = status;

    if (
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
        ...(normalizedStatus && {
          status: normalizedStatus as TaskStatus,
        }),
      },
    });
  }
  async deleteTask(id: string) {
    try {
      return await this.prismaService.task.delete({ where: { id } });
    } catch (error) {
      if ((error as any)?.code === 'P2025') {
        throw new NotFoundException(`Task not deleted, ${id} not found`);
      }
      throw error;
    }
  }
}
