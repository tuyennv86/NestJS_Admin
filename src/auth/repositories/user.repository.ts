import { UserRole } from './../enum/user-role.enum';
import { Repository, EntityRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { ConflictException, HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AuthsigninDto } from "../dto/auth-signin.dto";
import { AuthChangpassDto } from "../dto/auth-changpass.dto";
import { PaginationDto } from "../../utils/pagination.dto";
import { PaginatedUsersResultDto } from "../dto/paginated-users-result.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async changPass(authChangpassDto: AuthChangpassDto): Promise<User> {
        const { username, password, newPassword, confirmPassword } = authChangpassDto;
        const user = await this.findOne({ username });
        if (!user || !await user.validatePassword(password)) {
            // console.log('mat khau ko dung');
            throw new HttpException('Mật khẩu không đúng', HttpStatus.CONFLICT);
        }
        if (newPassword !== confirmPassword) {
            //console.log('mật khau khong trung nhau');
            throw new HttpException('Mật khẩu mới không trùng nhau', HttpStatus.CONFLICT);
        }
        user.satl = await bcrypt.genSalt();
        user.password = await this.hashPassword(newPassword, user.satl);
        console.log(authChangpassDto);

        await user.save();
        return user;
    }

    async signUp(avataUrl: string, authCredentialsDto: AuthCredentialsDto, userRole: UserRole): Promise<User> {
        const { fullname, username, password, email, phone } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.email = email;
        user.fullname = fullname;
        user.phone = phone;
        user.imageUrl = avataUrl;
        user.role = userRole;
        user.satl = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.satl);
        try {
            await user.save();
            return user;
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

    // User API
    public async getUsersByPaging(paginationDto: PaginationDto): Promise<PaginatedUsersResultDto> {
        const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
        const totalCount = await this.count();
        const users = await this.createQueryBuilder('user')
            .orderBy('id', "DESC")
            .offset(skippedItems)
            .limit(paginationDto.limit)
            .getMany();
        return {
            totalCount,
            page: paginationDto.page,
            limit: paginationDto.limit,
            data: users
        }
    }
}