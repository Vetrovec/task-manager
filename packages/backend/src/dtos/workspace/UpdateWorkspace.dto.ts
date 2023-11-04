import { IsString, IsOptional } from "class-validator";

export class UpdateWorkspaceDto {
  @IsString()
  @IsOptional() // Make the 'name' field optional
  name?: string;

  @IsString()
  @IsOptional() // Make the 'description' field optional
  description?: string;
}
