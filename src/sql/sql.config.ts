import { registerAs } from '@nestjs/config';
import { configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

configDotenv();

export const config = {
  url: process.env.SQL_DATABASE_URL,
  type: process.env.SQL_DATABASE_TYPE || 'postgres',
  host: process.env.SQL_DATABASE_HOST,
  port: process.env.SQL_DATABASE_PORT
    ? parseInt(process.env.SQL_DATABASE_PORT, 10)
    : 3306,
  password: process.env.SQL_DATABASE_PASSWORD,
  username: process.env.SQL_DATABASE_USERNAME,
  database: process.env.SQL_DATABASE_NAME,
  entities: [`${__dirname}/entities/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  autoLoadEntities: true,
  synchronize: process.env.SQL_DATABASE_SYNCHRONIZE || false,
};

export default registerAs('sql', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
