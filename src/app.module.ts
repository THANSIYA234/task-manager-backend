import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomLogger } from './common/logger/custom-logger/custom-logger';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TaskModule, PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, CustomLogger],
})
export class AppModule {}
