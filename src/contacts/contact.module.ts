import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRepository } from './repositories/contact.repository';
import { AuthModule } from '../auth/auth.module';
import { RedisCacheModule } from '../cache/redis-cache.module';


@Module({
    imports: [TypeOrmModule.forFeature([ContactRepository]),
        AuthModule, RedisCacheModule],
    controllers: [
        ContactController,],
    providers: [
        ContactService,],
    exports: [ContactService]
})
export class ContactModule { }
