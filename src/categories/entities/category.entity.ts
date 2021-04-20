import { IsDate } from "class-validator";
import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table")
//@Tree("materialized-path")
//@Tree("nested-set")

export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256 })
    name: string;

    @TreeChildren()
    children: Category[];

    @TreeParent()
    parent: Category;

    @Column({ nullable: true })
    parentId: number;

    @Column()
    order: number;

    @Column({ length: 256 })
    title: string;

    @Column()
    isPublished: boolean;

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn()
    @IsDate()
    createDate: Date;


}