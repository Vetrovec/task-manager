import { IWorkplace } from "@task-manager/shared";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Workplace implements IWorkplace {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 4000 })
  text: string;

  @OneToMany(() => Task, (task) => task.workplace)
  tasks: Task[];
}
