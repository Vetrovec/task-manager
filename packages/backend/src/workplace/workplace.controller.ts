import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { CreateWorkplaceDto } from "./dtos/CreateWorkplace.dto";
import { UpdateWorkplaceDto } from "./dtos/UpdateWorkplace.dto";
import { WorkplaceService } from "./workplace.service";

@Controller("workplace")
export class WorkplaceController {
  constructor(private workplaceService: WorkplaceService) {}

  @Get()
  async findAll() {
    // Implement findAll logic
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    // Implement findOne logic
  }

  @Post()
  async create(@Body() createWorkplaceDto: CreateWorkplaceDto) {
    // Implement create logic
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    // Implement update logic
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    // Implement delete logic
  }
}
