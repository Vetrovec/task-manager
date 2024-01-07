import { IUser } from "./auth.types";
import { IRole } from "./role.types";
import { IWorkplace } from "./workplace.types";

export interface IUserWorkplace {
  id: number;
  user: IUser;
  workplace: IWorkplace;
  role: IRole;
  createdAt: Date;
}
