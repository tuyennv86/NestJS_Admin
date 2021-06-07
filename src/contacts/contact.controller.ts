import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put, Query, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Contact } from './entities/contact.entity';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginatedContactsResultDto } from './dto/paginated-contacts-result.dto';
import { PaginationDto } from '../utils/pagination.dto';


@ApiTags("Contacts")
@Controller('contacts')

export class ContactController {
    private logger = new Logger('TasksController');
    constructor(private contactService: ContactService) { }

    @Get()
    getContact(): Promise<Contact[]> {
        return this.contactService.getAllContact();
    }

    @Get('/page')
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    getPaging(@Query() paginationDto: PaginationDto): Promise<PaginatedContactsResultDto> {

        paginationDto.page = Number(paginationDto.page > 0 ? paginationDto.page : 1);
        paginationDto.limit = Number(paginationDto.limit > 0 ? paginationDto.limit : 10);
        return this.contactService.getByPageing({
            ...paginationDto, limit: paginationDto.limit
        });
    }

    @Get('/:id')
    getContactById(@Param('id', ParseIntPipe) id: number): Promise<Contact> {
        // const found = this.contactService.getContactById(id);
        // if (!found) {
        //     throw new HttpException(`id ${id} không tồn tại`, HttpStatus.NOT_FOUND);
        // }
        // return found;
        return this.contactService.getContactById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createContact(@Body() createContactDto: CreateContactDto): Promise<Contact> {
        //this.logger.verbose(`Thêm mới contact :${JSON.stringify(createContactDto)}`);
        return this.contactService.createContact(createContactDto);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    updateContact(@Param('id', ParseIntPipe) id: number, @Body() createContactDto: CreateContactDto): Promise<Contact> {
        //this.logger.verbose(`Update contact theo Id: ${id} chi tiết :${JSON.stringify(createContactDto)}`);
        return this.contactService.updateContact(id, createContactDto);
    }

    @Delete('/:id')
    deleteContact(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.contactService.deleteById(id);
    }
}
