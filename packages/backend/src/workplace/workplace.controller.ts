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
import { AuthUser } from "@/auth/decorators/user.decorator";
import { User } from "@/entities/user.entity";

@UseGuards(JWTAuthGuard)
@Controller("workplace")
export class WorkplaceController {
  constructor(private workplaceService: WorkplaceService) {}

  @Get()
  async findAll(@AuthUser() user: User): Promise<IFindAllWorkplacesResponse> {
    const workplaces = await this.workplaceService.findAll(user);
    return { workplaces };
  }

  @Get(":id")
  async findOne(@AuthUser() user: User, @Param("id", ParseIntPipe) id: number) {
    const workplace = await this.workplaceService.findOne(id, user);
    if (!workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
    return workplace;
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createWorkplaceDto: CreateWorkplaceDto,
  ) {
    return this.workplaceService.create(createWorkplaceDto, user);
  }

  @Put(":id")
  async update(
    @AuthUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    const updatedWorkplace = await this.workplaceService.update(
      id,
      updateWorkplaceDto,
      user,
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
