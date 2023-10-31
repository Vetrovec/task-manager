import { type } from "os";

export type CreateTaskParams = {
  name: string;
  description: string;
  price: number;
  status: "open" | "closed";
};

export type UpdateTaskParams = {
  name: string;
  description: string;
  price: number;
  status: "open" | "closed";
};

export type CreateWorkspaceParams = {
  name: string;
  description: string;
};

export type UpdateWorkspaceParams = {
  name: string;
  description: string;
};
