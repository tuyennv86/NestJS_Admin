import { UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength, IsEmail } from "class-validator";
import { diskStorage } from "multer";

export class AuthUpdateUserDto {

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


    // @ApiConsumes('multipart/form-data')
    // @ApiBody({
    //     description: 'Upload file',
    //     type: FileUploadDto,
    // })
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: Helper.destinationPath,
    //         filename: Helper.customFileName,
    //     }),
    // }))

    // @ApiProperty({
    //     description: 'Đường dẫn ảnh đại diện',
    //     type: String
    // })
    // @IsString()
    // imageUrl: string;
}