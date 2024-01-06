import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  Column,
} from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";
import { IPayroll } from "@task-manager/shared";
import { Workplace } from "./workplace.entity";

@Entity()
export class Payroll implements IPayroll {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  beneficiary: User;

  @ManyToOne(() => Workplace)
  workplace: Workplace;

  @Column()
  total: number;

  @OneToMany(() => Task, (task) => task.payroll)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
