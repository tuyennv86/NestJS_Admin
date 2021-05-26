import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload-interface';
import { AuthsigninDto } from './dto/auth-signin.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async getAllUser(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserByUserName(username: string): Promise<User> {
        const user = await this.userRepository.findOne(username);
        if (!user) {
            throw new NotFoundException(`UserName "${username}" không tồn tại`);
        }
        return user;
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(uuthsigninDto: AuthsigninDto): Promise<{ accessToken: string, success: boolean }> {

        const username = await this.userRepository.validateUserPassword(uuthsigninDto);
        if (!username) {
            throw new UnauthorizedException('User hoặc mật khẩu không đúng!');
        }

        const success = true;
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken, success };
    }
}
