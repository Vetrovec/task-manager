import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Task, (task) => task.workspace, { cascade: true })
  tasks: Task[];
}
