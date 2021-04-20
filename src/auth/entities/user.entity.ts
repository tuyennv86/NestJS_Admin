import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from "../../tasks/entities/task.entity";
import { Category } from "../../categories/entities/category.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    satl: string;
    //eager: false không lấy dang sách các bảng liên kết eager: true lấy cả danh sách các bảng liên kết cascade:true tự động lưu các object liên quan
    @OneToMany(type => Task, task => task.user, { eager: false })
    tasks: Task[];

    @OneToMany(type => Category, category => category.user, { eager: false })
    categories: Category[]

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.satl);
        return hash === this.password;
    }
}