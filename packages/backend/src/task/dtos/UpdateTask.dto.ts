import { IUpdateTaskRequest, TaskStatus } from "@task-manager/shared";
import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateTaskDto implements IUpdateTaskRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  status?: TaskStatus;
}
