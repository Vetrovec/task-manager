import { ITask } from "@task-manager/shared";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
