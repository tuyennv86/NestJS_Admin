import { Contact } from "../entities/contact.entity";

export class PaginatedContactsResultDto {
    data: Contact[];
    page: number;
    limit: number;
    totalCount: number;
}