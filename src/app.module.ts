/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookstoreModule } from './modules/bookstore/bookstore.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './core/database/database.providers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    AuthModule,
    BookstoreModule,
  ],
})
export class AppModule {}
