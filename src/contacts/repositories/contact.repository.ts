import { InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Contact } from "../entities/contact.entity";
import { CreateContactDto } from "../dto/create-contact.dto";
import { PaginatedContactsResultDto } from "../dto/paginated-contacts-result.dto";
import { PaginationDto } from "../../utils/pagination.dto";

@EntityRepository(Contact)
export class ContactRepository extends Repository<Contact>{

    private logger = new Logger('ContactRepository');

    public async getContactByPaging(paginationDto: PaginationDto): Promise<PaginatedContactsResultDto> {
        const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
        const totalCount = await this.count();
        const contacts = await this.createQueryBuilder('contact')
            .orderBy('id', "DESC")
            .offset(skippedItems)
            .limit(paginationDto.limit)
            .getMany();
        return {
            totalCount,
            page: paginationDto.page,
            limit: paginationDto.limit,
            data: contacts
        }
    }

    async getAllContact(): Promise<Contact[]> {
        const query = this.createQueryBuilder("contact");
        try {
            const contacts = await query.getMany();
            return contacts;
        } catch (error) {
            this.logger.error(`Loi tim toàn bộ contact :`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createContact(createContactDto: CreateContactDto): Promise<Contact> {
        const { firstName, lastName, email, phone } = createContactDto;
        const contact = new Contact();
        contact.firstName = firstName;
        contact.lastName = lastName;
        contact.email = email;
        contact.phone = phone;
        await contact.save();
        return contact;
    }

    async updateContact(id: number, createContactDto: CreateContactDto): Promise<Contact> {
        const contact = await this.findOne(id);
        contact.firstName = createContactDto.firstName;
        contact.lastName = createContactDto.lastName;
        contact.email = createContactDto.email;
        contact.phone = createContactDto.phone;
        await contact.save();
        return contact;
    }

}