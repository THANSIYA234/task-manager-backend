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
  @ApiOperation({ summary: 'Get all tasks for the logged-in user' })
  async getAllTasks(@GetUser('id') userId: string) {
    const tasks = await this.taskService.getAllTasks(userId); // pass userId
    return ApiResponse.success('Tasks fetched successfully', tasks);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id (only if owned by user)' })
  async getTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') userId: string,
  ) {
    const task = await this.taskService.getTaskById(id, userId); // pass userId
    return ApiResponse.success('Task fetched successfully', task);
  }

  @Post()
  @ApiOperation({ summary: 'Create task for logged-in user' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('id') userId: string,
  ) {
    const task = await this.taskService.createTask(createTaskDto, userId);
    return ApiResponse.success('Task created successfully', task);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task by id (only if owned by user)' })
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser('id') userId: string,
  ) {
    const task = await this.taskService.updateTask(
      id,
      updateTaskStatusDto,
      userId,
    );
    return ApiResponse.success('Task updated successfully', task);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by id (only if owned by user)' })
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') userId: string,
  ) {
    const task = await this.taskService.deleteTask(id, userId);
    return ApiResponse.success('Task deleted successfully', task);
  }
}
