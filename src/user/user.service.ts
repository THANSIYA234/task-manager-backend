import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string }) {
    return await this.prismaService.user.create({ data });
  }
  async findEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }
  async findById(id: string) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }
  async findAll() {
    return await this.prismaService.user.findMany();
  }
}
