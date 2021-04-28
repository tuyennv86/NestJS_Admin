import { IsDate } from "class-validator";
import { Category } from "../../categories/entities/category.entity";
import { IsPublic } from "../../common/enum/Identifier.enum";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 256 })
    productName: string

    @Column({ length: 50 })
    productCode: string

    @Column()
    price: number

    @Column({ type: "int" })
    quantity: number

    @ManyToOne(type => Category, category => category.products, { eager: false })
    category: Category

    @Column()
    categoryId: number

    @Column()
    isPublished: IsPublic

    @Column()
    userIdCreate: number

    @Column()
    @IsDate()
    createDate: Date

}