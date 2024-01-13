import { ICreateTaskRequest } from "@task-manager/shared";
import { IsString, IsNumber, IsNotEmpty, Min } from "class-validator";

export class CreateTaskDto implements ICreateTaskRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string = "";

  @Min(1)
  @IsNumber()
  price: number;
}
