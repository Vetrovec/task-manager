import { IUpdateTaskRequest } from "@task-manager/shared";
import { IsString, IsNumber, IsIn, IsOptional } from "class-validator";

export class UpdateTaskDto implements IUpdateTaskRequest {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsIn(["open", "closed"])
  @IsOptional()
  status: "open" | "closed";
}
