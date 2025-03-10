import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Feedback } from 'src/feedback/entities/feedback.entity';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Feedback, (feedback) => feedback.customer, { cascade: true })
  feedbacks: Feedback[];
}
