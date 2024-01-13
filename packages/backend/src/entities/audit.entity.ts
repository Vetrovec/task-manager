import { IAudit } from "@task-manager/shared";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Audit implements IAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  entity: string;

  @Column()
  entityId: number;

  @Column("json", { nullable: true })
  relations: any;

  @Column("json", { nullable: true })
  data: any;

  @Column()
  actionType: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
