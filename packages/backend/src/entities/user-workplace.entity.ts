import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Workplace } from "./workplace.entity";
import { Role } from "./role.entity";
import { IUserWorkplace } from "@task-manager/shared";

@Entity()
@Unique(["user", "workplace"])
export class UserWorkplace implements IUserWorkplace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Workplace, { nullable: false })
  workplace: Workplace;

  @ManyToOne(() => Role, { nullable: false })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
