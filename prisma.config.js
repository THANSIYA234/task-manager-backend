'use strict';
// Use CommonJS module.exports to be robust across different Node/Prisma CLI environments (Render, CI, etc.)
require('dotenv/config');
const { defineConfig, env } = require('prisma/config');

module.exports = defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
