import { ICreateTaskRequest } from "@task-manager/shared";
import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateTaskDto implements ICreateTaskRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string = "";

  @IsNumber()
  price: number;
}
