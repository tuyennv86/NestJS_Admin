import { AuthUpdateUserDto } from './dto/auth-update-user.dto';
import { PaginationDto } from './../utils/pagination.dto';
import { PaginatedUsersResultDto } from './dto/paginated-users-result.dto';
import { AuthChangpassDto } from './dto/auth-changpass.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Query, UseInterceptors, UploadedFile, Param, ParseIntPipe, Delete, Put, UsePipes } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { AuthsigninDto } from './dto/auth-signin.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadDto } from './dto/file-upload.dto';
import { Helper } from '../utils/helper';
import * as config from 'config';

const localurl = config.get('localurl');

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get()
    getUser(): Promise<User[]> {
        return this.authService.getAllUser();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @ApiQuery({ name: "username", required: true })
    @Get('/getuser')
    async getUserByUserName(@Query() username: string): Promise<User> {
        return await this.authService.getUserByUserName(username);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('/user/:id')
    getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.authService.getById(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('/update')
    async update(@Body() authUpdateDto: AuthUpdateDto): Promise<User> {
        return await this.authService.update(authUpdateDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('/changpass')
    async changpass(@Body(ValidationPipe) authChangpassDto: AuthChangpassDto): Promise<User> {
        return await this.authService.changPass(authChangpassDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return await this.authService.signUp("", authCredentialsDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: Helper.destinationPath,
            filename: Helper.customFileName,
        }),
    }))
    @UsePipes(ValidationPipe)
    @Post('/signupimg')
    async signUpImg(@UploadedFile() file, @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return await this.authService.signUp(`${localurl.local}${file.path}`, authCredentialsDto);
    }
    @Post('/signin')
    async singIn(@Body(ValidationPipe) authsigninDto: AuthsigninDto): Promise<{ accessToken: string }> {
        return await this.authService.signIn(authsigninDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Delete('/:id')
    deleteContact(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.authService.deleteById(id);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('/:id/avatar')
    // @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload file',
        type: FileUploadDto,
    })

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: Helper.destinationPath,
            filename: Helper.customFileName,
        }),
    }))
    uploadAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() file): Promise<User> {
        return this.authService.setAvatar(id, `${localurl.local}${file.path}`);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('/list')
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    getPaging(@Query() paginationDto: PaginationDto): Promise<PaginatedUsersResultDto> {

        paginationDto.page = Number(paginationDto.page > 0 ? paginationDto.page : 1);
        paginationDto.limit = Number(paginationDto.limit > 0 ? paginationDto.limit : 10);
        return this.authService.getUsersByPaging({
            ...paginationDto, limit: paginationDto.limit
        });
    }


    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Put('/:id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: Helper.destinationPath,
            filename: Helper.customFileName,
        }),
    }))
    @UsePipes(ValidationPipe)
    updateUser(@Param('id', ParseIntPipe) id: number, @UploadedFile() file, @Body() authUpdateUserDto: AuthUpdateUserDto): Promise<User> {
        return this.authService.updateUser(id, `${localurl.local}${file.path}`, authUpdateUserDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Put('/NoImage/:id')
    @UsePipes(ValidationPipe)
    updateUserNoImage(@Param('id', ParseIntPipe) id: number, @Body() authUpdateUserDto: AuthUpdateUserDto): Promise<User> {
        return this.authService.updateUser(id, "", authUpdateUserDto);
    }
}