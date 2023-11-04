import { IsString, IsNumber, IsIn, IsNotEmpty } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsIn(["open", "closed"])
  status: "open" | "closed";
}
