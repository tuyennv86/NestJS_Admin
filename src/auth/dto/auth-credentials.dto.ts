import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, Matches, IsEmail } from "class-validator";

export class AuthCredentialsDto {

    @ApiProperty({
        description: 'Họ và tên có dài từ 4 - 256 ký tự',
        required: true,
        type: String,
        minimum: 4,
        maximum: 256
    })
    @IsString()
    @MaxLength(256)
    @MinLength(4)
    fullname: string;

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

    @ApiProperty({
        description: 'nhập email',
        required: true,
        type: String
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'nhập điện thoại',
        required: true,
        type: String
    })
    @IsString()
    phone: string;

    // @ApiProperty({
    //     description: 'Đường dẫn ảnh đại diện',
    //     type: String
    // })
    // @IsString()
    // imageUrl: string;
}