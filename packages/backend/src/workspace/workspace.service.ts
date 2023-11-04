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

  //get all workspaces
  findTasks() {
    return this.workspaceRepository.find();
  }

  //get workspace by id
  async findWorkspaceById(id: number) {
    return await this.workspaceRepository.find({ where: { id } });
  }

  //create workspace
  async createWorkspace(workspaceDetails: CreateWorkspaceParams) {
    const newWorkspace = this.workspaceRepository.create(workspaceDetails);
    await this.workspaceRepository.save(newWorkspace);
    return newWorkspace;
  }

  //delete workspace
  async deleteWorkspace(id: number) {
    await this.workspaceRepository.delete(id);
    return `Workspace with id ${id} has been deleted`;
  }

  //update workspace
  async updateWorkspace(id: number, updateWorkspace: UpdateWorkspaceParams) {
    await this.workspaceRepository.update(id, updateWorkspace);
    return this.workspaceRepository.find({ where: { id } });
  }
}
