import { Repository, EntityRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { ConflictException, HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AuthsigninDto } from "../dto/auth-signin.dto";
import { AuthChangpassDto } from "../dto/auth-changpass.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async changPass(authChangpassDto: AuthChangpassDto): Promise<void> {
        const { username, password, newPassword, confirmPassword } = authChangpassDto;
        const user = await this.findOne({ username });
        if (!user && !await user.validatePassword(password)) {
            throw new HttpException('Mật khẩu không đúng', HttpStatus.NOT_MODIFIED);
        }
        if (newPassword !== confirmPassword) {
            throw new HttpException('Mật khẩu mới không trùng nhau', HttpStatus.NOT_MODIFIED);
        }
        user.satl = await bcrypt.genSalt();
        user.password = await this.hashPassword(newPassword, user.satl);

        user.save();
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { fullname, username, password, email, phone, imageUrl } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.email = email;
        user.fullname = fullname;
        user.phone = phone;
        user.imageUrl = imageUrl;
        user.satl = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.satl);
        //console.log(user);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username đã tồn tại');
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    async validateUserPassword(authSigninDto: AuthsigninDto) {

        const { username, password } = authSigninDto;
        const user = await this.findOne({ username });
        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }

    }

    private async hashPassword(password: string, satl: string): Promise<string> {
        return bcrypt.hash(password, satl);
    }
}