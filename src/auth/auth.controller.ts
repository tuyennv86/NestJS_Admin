import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    singIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Get('/profile')
    @UseGuards(AuthGuard())
    //@UseGuards(RolesGuard)
    public async testAuth(@Req() req): Promise<User> {
        return req.user;
    }


}