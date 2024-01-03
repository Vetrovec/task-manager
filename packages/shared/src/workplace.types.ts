import { IUser } from "./auth.types";
import { UserWorkplaceRole } from "./enums.types";

export interface IWorkplace {
  id: number;
  createdAt: Date;
  name: string;
  text: string;
}

export interface IFindAllWorkplacesResponse {
  workplaces: IWorkplace[];
}

export interface IFindOneWorkplaceResponse {
  workplace: IWorkplace;
  users: {
    user: IUser;
    role: UserWorkplaceRole;
  }[];
}
