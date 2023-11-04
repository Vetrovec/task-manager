import { IsString, IsOptional } from "class-validator";

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional() // Make the 'description' field optional
  description?: string;
}
