import { IsString, Length } from "class-validator";

export class CreateWorkplaceDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 4000)
  text: string;
}
