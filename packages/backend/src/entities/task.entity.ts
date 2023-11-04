import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workspace } from "./workspace.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: "OPEN" })
  status: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.tasks)
  workspace: Workspace;
}
