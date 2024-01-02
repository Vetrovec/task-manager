import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Workplace } from "@/entities/workplace.entity";
import { CreateWorkplaceDto } from "./dtos/CreateWorkplace.dto";
import { UpdateWorkplaceDto } from "./dtos/UpdateWorkplace.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class WorkplaceService {
  constructor(
    @InjectRepository(Workplace)
    private workplaceRepository: Repository<Workplace>,
  ) {}

  async findAll(): Promise<Workplace[]> {
    return this.workplaceRepository.find();
  }

  async findOne(id: number): Promise<Workplace> {
    const workplace = await this.workplaceRepository.findOne({
      where: { id },
    });
    if (!workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return workplace;
  }

  async create(createWorkplaceDto: CreateWorkplaceDto): Promise<Workplace> {
    const newWorkplace = this.workplaceRepository.create(createWorkplaceDto);
    return this.workplaceRepository.save(newWorkplace);
  }

  async update(
    id: number,
    updateWorkplaceDto: UpdateWorkplaceDto,
  ): Promise<Workplace> {
    const workplace = await this.findOne(id);
    if (!workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    this.workplaceRepository.merge(workplace, updateWorkplaceDto);
    return this.workplaceRepository.save(workplace);
  }

  async delete(id: number): Promise<void> {
    const result = await this.workplaceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
  }
}
