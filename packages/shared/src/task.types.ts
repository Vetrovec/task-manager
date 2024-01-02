import { TaskStatus } from "./enums.types";

export interface ITask {
  id: number;
  name: string;
  description: string;
  price: number;
  status: TaskStatus;
}

export interface IFindAllTasksResponse {
  tasks: ITask[];
}

export interface IFindOneTaskResponse {
  task: ITask;
}

export interface ICreateTaskRequest {
  name: string;
  description?: string;
  price: number;
}

export interface ICreateTaskResponse {
  task: ITask;
}

export interface IUpdateTaskRequest {
  name?: string;
  description?: string;
  price?: number;
  status?: TaskStatus;
}

export interface IUpdateTaskResponse {
  task: ITask;
}

export interface IDeleteTaskResponse {
  success: boolean;
  message: string;
}
