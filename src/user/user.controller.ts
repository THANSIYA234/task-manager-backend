import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'get user by id' })
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
