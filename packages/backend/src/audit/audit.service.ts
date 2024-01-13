import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Audit } from "@/entities/audit.entity";
import { Repository } from "typeorm";
import { CreateAuditDto } from "./dtos/CreateAudit.dto";
import { EntityEnum } from "./EntityEnum";

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  async createAuditRecord(dto: CreateAuditDto): Promise<Audit> {
    const auditRecord = this.auditRepository.create(dto);
    return this.auditRepository.save(auditRecord);
  }

  async getAuditsForEntity(
    entity: EntityEnum,
    entityId?: number,
  ): Promise<Audit[]> {
    let query = this.auditRepository
      .createQueryBuilder("audit")
      .where("audit.entity = :entity", { entity });

    if (entityId !== undefined) {
      query = query.andWhere("audit.entityId = :entityId", { entityId });
    }

    return query.getMany();
  }
}
