import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsIn, IsNotEmpty, IsNumber, Min } from "class-validator";
import { CategoryType } from "src/common/enum/Identifier.enum";

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    parentId: number

    @ApiProperty()
    @IsNotEmpty()
    order: number;

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    pageSize: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userIdCreate: number;

    @ApiProperty()
    @IsDate()
    createDate: Date;
}