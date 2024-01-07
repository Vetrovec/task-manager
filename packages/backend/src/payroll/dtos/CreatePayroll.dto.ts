import { IsNumber } from "class-validator";

export class CreatePayrollDto {
  @IsNumber()
  userId: number;
}
