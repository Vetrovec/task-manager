import { ITask, TaskStatus } from "@task-manager/shared";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Workplace } from "./workplace.entity"; // Adjust the import path as needed
import { User } from "./user.entity";

@Entity()
export class Task implements ITask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  user: User | null;

  @ManyToOne(() => Workplace, (workplace) => workplace.tasks, {
    nullable: false,
  })
  workplace: Workplace;
}
