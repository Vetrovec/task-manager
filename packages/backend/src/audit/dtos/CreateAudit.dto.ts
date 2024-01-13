import { IsString, IsNumber, IsNotEmpty, IsObject } from "class-validator";

export class CreateAuditDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  entity: string;

  @IsNotEmpty()
  @IsNumber()
  entityId: number;

  @IsObject()
  relations: any;

  @IsObject()
  data: any;

  @IsNotEmpty()
  @IsString()
  actionType: string;

  @IsString()
  description: string;
}
