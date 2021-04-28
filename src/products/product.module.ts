import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductRepository]),
        AuthModule
    ],
    controllers: [
        ProductController,],
    providers: [
        ProductService,],
})
export class ProductModule { }
