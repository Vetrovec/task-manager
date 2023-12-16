import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Task } from './task.entity';


@Entity()
export class Workplace {
  @PrimaryGeneratedColumn("uuid")
  workplaceID: string;

  @CreateDateColumn()
  creationDate: Date;

  @Column({length: 255})
  name: string;

  @Column({length: 4000})
  text: string;

  @OneToMany(() => Task, task => task.workplace)
  tasks: Task[];
}
