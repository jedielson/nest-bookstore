/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookstoreModule } from './modules/bookstore/bookstore.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './core/database/database.providers';
import { LocationInterceptor } from './core/http/location.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UsersModule,
    AuthModule,
    BookstoreModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LocationInterceptor,
    },
  ],
})
export class AppModule {}
