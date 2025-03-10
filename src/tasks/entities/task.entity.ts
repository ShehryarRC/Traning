import { Column,  PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending',
      })
      status: string;

    @Column()
    assiged_to:string;

}
