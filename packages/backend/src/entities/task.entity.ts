import { ITask, TaskStatus } from "@task-manager/shared";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Workplace } from "./workplace.entity"; // Adjust the import path as needed
import { User } from "./user.entity";
import { Payroll } from "./payroll.entity";

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

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  user: User | null;

  @ManyToOne(() => Workplace, (workplace) => workplace.tasks, {
    nullable: false,
  })
  workplace: Workplace;

  @ManyToOne(() => Payroll, (payroll) => payroll.tasks, { nullable: true })
  payroll: Payroll | null;
}
