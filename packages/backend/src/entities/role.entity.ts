import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IRole, UserWorkplaceRole } from "@task-manager/shared";

@Entity()
export class Role implements IRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: UserWorkplaceRole;
}
