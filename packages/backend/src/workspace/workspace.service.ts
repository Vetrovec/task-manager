import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateWorkspaceParams, UpdateWorkspaceParams } from "src/utils/types";
import { Workspace } from "src/entities/workspace.entity";
import { Repository } from "typeorm";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  findTasks() {
    return this.workspaceRepository.find();
  }

  async findWorkspaceById(id: number) {
    return await this.workspaceRepository.find({ where: { id } });
  }

  async createWorkspace(workspaceDetails: CreateWorkspaceParams) {
    const newWorkspace = this.workspaceRepository.create(workspaceDetails);
    await this.workspaceRepository.save(newWorkspace);
    return newWorkspace;
  }

  async deleteWorkspace(id: number) {
    await this.workspaceRepository.delete(id);
    return `Workspace with id ${id} has been deleted`;
  }

  async updateWorkspace(id: number, updateWorkspace: UpdateWorkspaceParams) {
    await this.workspaceRepository.update(id, updateWorkspace);
    return this.workspaceRepository.find({ where: { id } });
  }
}
