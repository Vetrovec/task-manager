import { UserWorkplaceRole } from "@task-manager/shared";
import { IsEmail, IsString } from "class-validator";

export class AddUserDto {
  @IsEmail()
  email: string;

  @IsString()
  role: UserWorkplaceRole;
}
