import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { EntityEnum } from "./EntityEnum";
import { Audit } from "@/entities/audit.entity";
import { JWTAuthGuard } from "@/auth/guards/jwt-auth.guard";

@UseGuards(JWTAuthGuard)
@Controller("audits")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(":entity")
  getAudits(
    @Param("entity") entity: EntityEnum,
    @Query("entityId") entityId?: number,
  ): Promise<Audit[]> {
    return this.auditService.getAuditsForEntity(entity, entityId);
  }
}
