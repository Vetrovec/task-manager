import { IUser } from "./auth.types";
import { ITask } from "./task.types";

export interface IPayroll {
  id: number;
  createdBy: IUser;
  beneficiary: IUser;
  total: number;
  createdAt: Date;
}

export interface IFindAllPayrollResponse {
  payrolls: IPayroll[];
}

export interface IFindOnePayrollResponse {
  payroll: IPayroll;
  tasks: ITask[];
}

export interface IPreviewPayrollResponse {
  tasks: ITask[];
}

export interface ICreatePayrollResponse {
  payroll: IPayroll;
  tasks: ITask[];
}
