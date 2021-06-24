/* istanbul ignore file */
import * as dotenv from 'dotenv';
import { Author } from 'src/modules/bookstore/author/author.entity';
import { Book } from 'src/modules/bookstore/book/book.entity';
import { User } from 'src/modules/users/user.entity';
import { IDatabaseConfig } from './interfaces/bdConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
  development: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    synchronize: true,
    entities: [User, Author, Book],
    logging: 'all',
  },
  test: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    synchronize: true,
    entities: [User, Author, Book],
    logging: 'all',
  },
  production: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PRODUCTION,
    entities: [User, Author, Book],
    logging: 'all',
  },
};
