import { ITask } from "@task-manager/shared";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Workplace } from './workplace.entity'; // Adjust the import path as needed

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

  @Column({ default: "open" })
  status: "open" | "closed";

  @ManyToOne(() => Workplace, workplace => workplace.tasks)
  workplace: Workplace;
}
