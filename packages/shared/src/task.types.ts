export interface ITask {
  id: number;
  name: string;
  description: string;
  price: number;
  status: "open" | "closed";
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
  status: "open" | "closed";
}

export interface ICreateTaskResponse {
  task: ITask;
}

export interface IUpdateTaskRequest {
  name?: string;
  description?: string;
  price?: number;
  status?: "open" | "closed";
}

export interface IUpdateTaskResponse {
  task: ITask;
}

export interface IDeleteTaskResponse {
  success: boolean;
  message: string;
}
