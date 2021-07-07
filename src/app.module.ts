import { AppController } from './app.controller';
import { ProductModule } from './products/product.module';
import { RedisCacheModule } from './cache/redis-cache.module';
import { CategoriesModule } from './categories/categories.module';
import { ContactModule } from './contacts/contact.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ContactController } from './contacts/contact.controller';


@Module({
  imports: [
    ProductModule,
    RedisCacheModule,
    CategoriesModule,
    ContactModule,
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [
    AppController
  ],
  providers: [
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .exclude({ path: 'contacts', method: RequestMethod.ALL })
  //     .forRoutes(ContactController)
  // }
}
