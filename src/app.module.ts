import { RedisCacheModule } from './cache/redis-cache.module';
import { CategoriesModule } from './categories/categories.module';
import { ContactModule } from './contacts/contact.module';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    RedisCacheModule,
    CategoriesModule,
    ContactModule,
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig)
  ],
})
export class AppModule { }
