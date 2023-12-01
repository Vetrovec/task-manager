import { IsString, IsUUID, Length, IsOptional } from "class-validator";

export class UpdateWorkplaceDto {
  @IsUUID()
  @IsOptional()
  workplaceID?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(1, 4000)
  @IsOptional()
  text?: string;
}
