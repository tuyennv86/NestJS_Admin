import { AuthChangpassDto } from './dto/auth-changpass.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Req, Query, UseInterceptors, UploadedFile, Param, ParseIntPipe, Res } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { AuthsigninDto } from './dto/auth-signin.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadDto } from './dto/file-upload.dto';
import { Helper } from '../utils/helper';
import { multerOptions } from '../config/multer.config';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    SERVER_URL = "http://localhost:3000/auth/";
    constructor(private authService: AuthService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get()
    getUser(): Promise<User[]> {
        return this.authService.getAllUser();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('/getuser')
    async getUserByUserName(@Query() username: string): Promise<User> {
        return await this.authService.getUserByUserName(username);
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

    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return await this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async singIn(@Body(ValidationPipe) authsigninDto: AuthsigninDto): Promise<{ accessToken: string }> {
        return await this.authService.signIn(authsigninDto);
    }

    @ApiBearerAuth()
    @Get('/profile')
    @UseGuards(AuthGuard())
    public async testAuth(@Req() req): Promise<User> {
        return req.user;
    }


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
    uploadAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File): Promise<User> {
        return this.authService.setAvatar(id, `${this.SERVER_URL}${file.path}`);
    }

    @Get('/avatars/:year/:month/:fileId')
    async serveAvatar(@Param('fileId') fileId, @Param('year') year, @Param('month') month, @Res() res): Promise<any> {
        res.sendFile(fileId, { root: 'avatars/' + year + "/" + month });
    }
}