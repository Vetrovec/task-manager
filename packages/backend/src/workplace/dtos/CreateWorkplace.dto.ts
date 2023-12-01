import { IsString, IsUUID, Length } from "class-validator";

export class CreateWorkplaceDto {
  @IsUUID()
  workplaceID: string;

  @IsString()
  creationDate: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 4000)
  text: string;
}
