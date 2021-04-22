import { IsDate } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table")
//@Tree("materialized-path")
//@Tree("nested-set")

export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    title: string;

    @Column()
    pageSize: number;

    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;

    @Column({ nullable: true })
    parentId: number;

    @Column()
    order: number;

    @Column()
    isPublished: boolean;

    @Column()
    userId: number;

    @CreateDateColumn()
    @IsDate()
    createDate: Date;


}