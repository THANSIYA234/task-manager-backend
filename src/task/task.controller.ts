import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskStatusDto } from './update-taskstatus.dto';
import { ApiResponse } from 'src/common/utils/response.util';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetUser } from 'src/common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@ApiTags('task')
@ApiBearerAuth('access-token')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async getAllTasks() {
    const tasks = await this.taskService.getAllTasks(); // array guaranteed
    return ApiResponse.success('Tasks fetched successfully', tasks);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  async getTaskById(@Param('id') id: string) {
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      return ApiResponse.error('no tasks found', HttpStatus.NOT_FOUND);
    }
    return ApiResponse.success('Tasks fetched successfully', task);
  }

  @Post()
  @ApiOperation({ summary: 'create task' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('id') userId: string,
  ) {
    try {
      const tasks = await this.taskService.createTask(createTaskDto, userId);
      return ApiResponse.success('Task created successfully', tasks);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'update task by id' })
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto, // validated DTO
  ) {
    try {
      const task = await this.taskService.updateTask(id, updateTaskStatusDto);
      return ApiResponse.success('Task updated', task);
    } catch (error) {
      return ApiResponse.error('Task not updated', HttpStatus.BAD_REQUEST);
    }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'delete task by id' })
  async deleteTask(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const task = await this.taskService.deleteTask(id);
      return ApiResponse.success('Task deleted', task);
    } catch (error) {
      return ApiResponse.error('Task not deleted', HttpStatus.BAD_REQUEST);
    }
  }
}
