import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditService } from "./audit.service";
import { Audit } from "@/entities/audit.entity";
import { AuditController } from "./audit.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
