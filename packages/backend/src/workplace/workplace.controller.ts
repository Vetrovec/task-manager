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
import {
  IFindAllWorkplacesResponse,
  IFindOneWorkplaceResponse,
} from "@task-manager/shared";
import { JWTAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { AuthUser } from "@/auth/decorators/user.decorator";
import { User } from "@/entities/user.entity";
import { AddUserDto } from "./dtos/AddUser.dto";

@UseGuards(JWTAuthGuard)
@Controller("workplace")
export class WorkplaceController {
  constructor(private workplaceService: WorkplaceService) {}

  @Get()
  async findAll(@AuthUser() user: User): Promise<IFindAllWorkplacesResponse> {
    const workplaces = await this.workplaceService.findForUser(user);
    return { workplaces };
  }

  @Get(":workplaceId")
  async findOne(
    @AuthUser() user: User,
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
  ): Promise<IFindOneWorkplaceResponse> {
    const workplaceDetails = await this.workplaceService.getWorkplaceDetails(
      workplaceId,
      user,
    );
    return workplaceDetails;
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
    @Param("id", ParseIntPipe) workplaceId: number,
    @Body() updateWorkplaceDto: UpdateWorkplaceDto,
  ) {
    const updatedWorkplace = await this.workplaceService.update(
      workplaceId,
      updateWorkplaceDto,
      user,
    );
    if (!updatedWorkplace) {
      throw new NotFoundException(
        `Workplace with ID ${workplaceId} not found.`,
      );
    }
    return updatedWorkplace;
  }

  @Delete(":workplaceId")
  async delete(@Param("workplaceId", ParseIntPipe) workplaceId: number) {
    await this.workplaceService.delete(workplaceId);
  }

  @Post(":workplaceId/user")
  async addUser(
    @AuthUser() user: User,
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
    @Body() addUserDto: AddUserDto,
  ) {
    await this.workplaceService.addUser(workplaceId, addUserDto, user);
  }
}
