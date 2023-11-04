export type GetStatusResponse = {
  status: string;
};

export interface CreateTask {
  name: string;
  description?: string;
  price: number;
  status: "open" | "closed";
}

export interface UpdateTask {
  name?: string;
  description?: string;
  price?: number;
  status?: "open" | "closed";
}
