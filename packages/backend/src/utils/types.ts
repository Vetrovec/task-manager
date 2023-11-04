export type CreateTaskParams = {
  name: string;
  description?: string;
  price: number;
  status: "open" | "closed";
};

export type UpdateTaskParams = {
  name?: string;
  description?: string;
  price?: number;
  status?: "open" | "closed";
};
