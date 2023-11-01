import { IsString, IsNumber, IsIn, IsOptional } from "class-validator";

export class UpdateTaskDto {
  @IsString()
  @IsOptional() // Make the 'name' field optional
  name?: string;

  @IsString()
  @IsOptional() // Make the 'description' field optional
  description?: string;

  @IsNumber()
  @IsOptional() // Make the 'price' field optional
  price?: number;

  @IsIn(["open", "closed"])
  @IsOptional() // Make the 'status' field optional
  status?: "open" | "closed";
}
