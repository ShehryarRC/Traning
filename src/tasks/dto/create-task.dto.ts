import { Column, PrimaryColumnOptions, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class CreateTaskDto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({default:'pending', enum:['pending','in_progress','completed']})
    status: string;

    @Column()
    assiged_to:string;

}