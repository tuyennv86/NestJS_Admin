import { AuthChangpassDto } from './dto/auth-changpass.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload-interface';
import { AuthsigninDto } from './dto/auth-signin.dto';
import { User } from './entities/user.entity';
import { unlinkSync } from 'fs';
import { PaginationDto } from '../utils/pagination.dto';
import { PaginatedUsersResultDto } from './dto/paginated-users-result.dto';

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

    async getById(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`Không tìm thấy id "${id}" của bạn`);
        }
        return user;
    }
    async update(authUpdateDto: AuthUpdateDto): Promise<User> {
        const user = await this.getById(authUpdateDto.id);
        user.fullname = authUpdateDto.fullname;
        user.email = authUpdateDto.email;
        user.phone = authUpdateDto.phone;
        await user.save();
        return user;
    }

    async changPass(authChangpassDto: AuthChangpassDto): Promise<User> {
        return this.userRepository.changPass(authChangpassDto);
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authsigninDto: AuthsigninDto): Promise<{ accessToken: string, success: boolean }> {

        const username = await this.userRepository.validateUserPassword(authsigninDto);
        if (!username) {
            throw new UnauthorizedException('User hoặc mật khẩu không đúng!');
        }

        const success = true;
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken, success };
    }

    public async setAvatar(id: number, avatarUrl: string): Promise<User> {
        const user = await this.getById(id);
        unlinkSync("./" + user.imageUrl.substring(27));// chu y khi up lên server thi đổi lại số thứ tự
        user.imageUrl = avatarUrl;
        await user.save();
        return user;
    }

    public async getUsersByPaging(paginationDto: PaginationDto): Promise<PaginatedUsersResultDto> {
        return await this.userRepository.getUsersByPaging(paginationDto);
    }
}
