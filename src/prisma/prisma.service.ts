// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import PrismaPkg from '@prisma/client';

const { PrismaClient } = PrismaPkg; // get PrismaClient from default export

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Allow overriding the datasource at runtime (useful for production / containers)
    const url =
      process.env.DATABASE_URL ||
      process.env.PRISMA_ACCELERATE_URL ||
      process.env.ACCELERATE_URL;
    const options: any = {};
    if (url) {
      options.datasources = { db: { url } };
    }
    // Reduce logs in production, but keep errors always
    options.log =
      process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'info', 'warn', 'error'];

    super(options as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
