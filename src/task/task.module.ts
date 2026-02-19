import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

import { CustomLogger } from 'src/common/logger/custom-logger/custom-logger';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[PrismaModule,AuthModule],
  providers: [TaskService,CustomLogger],
  controllers: [TaskController]
})
export class TaskModule {}
