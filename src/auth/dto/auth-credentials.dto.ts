import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    @ApiProperty({
        description: 'Tên đăng nhập có độ dài từ 4 - 20 ký tự',
        required: true,
        type: String,
        minimum: 4,
        maximum: 20
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({
        description: 'Nhập mật khẩu có độ dài từ 8 -20 ký tự bao gồm cả ký tự đặc biệt chữ hoa và chữ thường',
        required: true,
        type: String,
        minimum: 8,
        maximum: 20
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'mật khẩu quá yếu' }
    )
    password: string;
}