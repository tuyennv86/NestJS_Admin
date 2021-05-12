import { IsNotEmpty } from "class-validator"

export class CreateProductDto {

    @IsNotEmpty()
    productName: string

    @IsNotEmpty()
    productCode: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    categoryId: number

    @IsNotEmpty()
    userIdCreate: number

    @IsNotEmpty()
    createDate: Date
}