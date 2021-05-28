import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsEmail, IsNumber } from "class-validator";

export class AuthUpdateDto {

    @ApiProperty({
        description: 'Id user',
        required: true
    })
    @IsNumber()
    id: number;

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
}