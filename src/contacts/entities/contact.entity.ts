import { IsEmail, Length } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(50)
    firstName: string;

    @Column()
    @Length(50)
    lastName: string;

    @Column()
    @IsEmail()
    @Length(256)
    email: string;

    @Column()
    phone: string;

}