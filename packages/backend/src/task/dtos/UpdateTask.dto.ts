export class UpdateTaskDto {
  name: string;
  description: string;
  price: number;
  status: "open" | "closed";
}
