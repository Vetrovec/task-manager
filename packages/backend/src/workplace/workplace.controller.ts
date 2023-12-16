import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { CreateWorkplaceDto } from "./dtos/CreateWorkplace.dto";
import { UpdateWorkplaceDto } from "./dtos/UpdateWorkplace.dto";
import { WorkplaceService } from "./workplace.service";

@Controller("workplace")
export class WorkplaceController {
  constructor(private workplaceService: WorkplaceService) {}

  @Get()
  async findAll() {
    return this.workplaceService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
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
      @Param("id") id: string,
      @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    const updatedWorkplace = await this.workplaceService.update(id, updateWorkplaceDto);
    if (!updatedWorkplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return updatedWorkplace;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      await this.workplaceService.delete(id);
    } catch (e) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return {};
  }
}
