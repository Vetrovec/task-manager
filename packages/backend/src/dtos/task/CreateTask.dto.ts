import { CreateTask } from "@task-manager/shared";
import {
  IsString,
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class CreateTaskDto implements CreateTask {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsIn(["open", "closed"])
  status: "open" | "closed";
}
