import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TaskStatus } from "../enum/task-status.enum";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(() => User, user => user.tasks, { eager: false })
    user: User;

    @Column()
    userId: number;
}