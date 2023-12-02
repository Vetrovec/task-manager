import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Workplace } from "@/entities/workplace.entity";

@Injectable()
export class WorkplaceService {
  constructor(
    @InjectRepository(Workplace)
    private workplaceRepository: Repository<Workplace>,
  ) {}

  // Implement methods for create, find, update, delete
}
