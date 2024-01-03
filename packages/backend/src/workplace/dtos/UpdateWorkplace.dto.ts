import { IsString, Length, IsOptional } from "class-validator";

export class UpdateWorkplaceDto {
  @IsString()
  @Length(1, 255)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(1, 4000)
  @IsOptional()
  text?: string;
}
