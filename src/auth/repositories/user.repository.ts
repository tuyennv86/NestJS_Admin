import { Repository, EntityRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AuthsigninDto } from "../dto/auth-signin.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

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
        console.log(user);

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

    async validateUserPassword(uuthSigninDto: AuthsigninDto) {

        const { username, password } = uuthSigninDto;
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