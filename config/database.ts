import { registerAs } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';

export default registerAs(
  'db',
  async () =>
    ({
      dialect: process.env.DB_DIALECT || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'test',
      timestamps: true,
      logging: false,
    }) as SequelizeOptions,
);
