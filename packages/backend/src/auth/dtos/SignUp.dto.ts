import { IsEmail, MinLength } from "class-validator";

export class SignUpDto {
  @MinLength(3)
  readonly displayName: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;
}
