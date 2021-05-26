import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Req, Param, Query } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
// import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthsigninDto } from './dto/auth-signin.dto';

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
    @Get('/getuser')
    async getUserByUserName(@Query() username: string): Promise<User> {
        return await this.authService.getUserByUserName(username);
    }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async singIn(@Body(ValidationPipe) authsigninDto: AuthsigninDto): Promise<{ accessToken: string }> {
        return await this.authService.signIn(authsigninDto);
    }

    @ApiBearerAuth()
    @Get('/profile')
    @UseGuards(AuthGuard())
    //@UseGuards(RolesGuard)
    public async testAuth(@Req() req): Promise<User> {
        return req.user;
    }
}