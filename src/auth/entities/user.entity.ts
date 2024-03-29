import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from "../../tasks/entities/task.entity";
import { IsEmail } from "class-validator";
import { UserRole } from "../enum/user-role.enum";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    imageUrl: string;

    @Column()
    phone: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @Column()
    satl: string;
    //eager: false không lấy dang sách các bảng liên kết eager: true lấy cả danh sách các bảng liên kết cascade:true tự động lưu các object liên quan
    @OneToMany(() => Task, task => task.user, { eager: false })
    tasks: Task[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.satl);
        return hash === this.password;
    }
}
