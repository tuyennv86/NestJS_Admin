import { IsDate } from "class-validator";
import { CategoryType, IsPublic } from "../../common/enum/Identifier.enum";
import { Product } from "../../products/entities/product.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table")

export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    title: string;

    @Column()
    pageSize: number;

    @Column()
    typeCode: CategoryType

    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;

    @Column({ nullable: true })
    parentId: number;

    @Column()
    order: number;

    @Column()
    isPublished: IsPublic;

    @Column()
    userIdCreate: number;

    @CreateDateColumn()
    @IsDate()
    createDate: Date;

    @OneToMany(() => Product, product => product.category, { eager: false })
    products: Product[]
}