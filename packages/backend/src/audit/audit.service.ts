import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Audit } from "@/entities/audit.entity";
import { Repository } from "typeorm";
import { CreateAuditDto } from "./dtos/CreateAudit.dto";

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
}
