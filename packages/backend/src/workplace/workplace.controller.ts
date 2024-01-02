import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CreateWorkplaceDto } from "./dtos/CreateWorkplace.dto";
import { UpdateWorkplaceDto } from "./dtos/UpdateWorkplace.dto";
import { WorkplaceService } from "./workplace.service";
import { IFindAllWorkplacesResponse } from "@task-manager/shared";
import { JWTAuthGuard } from "@/auth/guards/jwt-auth.guard";

@UseGuards(JWTAuthGuard)
@Controller("workplace")
export class WorkplaceController {
  constructor(private workplaceService: WorkplaceService) {}

  @Get()
  async findAll(): Promise<IFindAllWorkplacesResponse> {
    const workplaces = await this.workplaceService.findAll();
    return { workplaces };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const workplace = await this.workplaceService.findOne(id);
    if (!workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return workplace;
  }

  @Post()
  async create(@Body() createWorkplaceDto: CreateWorkplaceDto) {
    return this.workplaceService.create(createWorkplaceDto);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    const updatedWorkplace = await this.workplaceService.update(
      id,
      updateWorkplaceDto,
    );
    if (!updatedWorkplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return updatedWorkplace;
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      await this.workplaceService.delete(id);
    } catch (e) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return {};
  }
}
