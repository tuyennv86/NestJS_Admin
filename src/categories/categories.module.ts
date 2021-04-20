import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './repositories/category.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryRepository]),
        AuthModule
    ],
    controllers: [
        CategoriesController,],
    providers: [
        CategoriesService,],
})
export class CategoriesModule { }
