import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "src/dtos/workspace/CreateWorkspace.dto";
import { UpdateWorkspaceDto } from "src/dtos/workspace/UpdateWorkspace.dto";

@Controller("workspace")
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get()
  getTasks() {
    return this.workspaceService.findTasks();
  }

  //get workspace by id
  @Get(":id")
  getTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.workspaceService.findWorkspaceById(id);
  }

  @Post()
  createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(createWorkspaceDto);
  }

  @Put(":id")
  updateWorkspace(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(id, updateWorkspaceDto);
  }

  @Delete(":id")
  deleteWorkspace(@Param("id", ParseIntPipe) id: number) {
    return this.workspaceService.deleteWorkspace(id);
  }
}
