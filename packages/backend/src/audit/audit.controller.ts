import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { EntityEnum } from "./EntityEnum";
import { JWTAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { IGetAuditsResponse } from "@task-manager/shared";

@UseGuards(JWTAuthGuard)
@Controller("audits")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(":entity")
  async getAudits(
    @Param("entity") entity: EntityEnum,
    @Query("entityId") entityId?: number,
  ): Promise<IGetAuditsResponse> {
    const log = await this.auditService.getAuditsForEntity(entity, entityId);
    return { log };
  }
}
