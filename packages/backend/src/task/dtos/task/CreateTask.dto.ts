export class CreateTaskDto {
  name: string;
  description: string;
  price: number;
  status: "open" | "closed";
}
