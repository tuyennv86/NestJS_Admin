import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from '../cache/redis-cache.service';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './repositories/contact.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginatedContactsResultDto } from './dto/paginated-contacts-result.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactRepository)
        private contactRepository: ContactRepository,
        private readonly cacheManager: RedisCacheService
    ) { }

    public async getByPageing(paginationDto: PaginationDto): Promise<PaginatedContactsResultDto> {

        return await this.contactRepository.getContactByPaging(paginationDto);
    }

    async getAllContact(): Promise<Contact[]> {
        return this.contactRepository.getAllContact();
    }

    async getContactById(id: number): Promise<Contact> {
        let found;
        found = await this.cacheManager.get("contact_getby_" + id);
        if (!found) {
            found = await this.contactRepository.findOne(id);
            await this.cacheManager.set("contact_getby_" + id, found);
            if (!found) {
                throw new NotFoundException(`Không tìm thấy id "${id}" của bạn`);
            }
        }
        return found;
    }

    async createContact(createContactDto: CreateContactDto): Promise<Contact> {
        await this.cacheManager.reset();
        return this.contactRepository.save(createContactDto);
    }

    async updateContact(id: number, createContactDto: CreateContactDto): Promise<Contact> {
        await this.cacheManager.reset();
        return this.contactRepository.updateContact(id, createContactDto);
    }

    async deleteById(id: number): Promise<void> {
        const result = await this.contactRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Không tìm thấy ${id} của bạn`);
        }
    }

}
