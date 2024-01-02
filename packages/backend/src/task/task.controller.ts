import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ICreateTaskResponse,
  IDeleteTaskResponse,
  IFindAllTasksResponse,
  IFindOneTaskResponse,
  IUpdateTaskResponse,
} from "@task-manager/shared";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dtos/CreateTask.dto";
import { UpdateTaskDto } from "./dtos/UpdateTask.dto";
import { AuthUser } from "@/auth/decorators/user.decorator";
import { User } from "@/entities/user.entity";
import { JWTAuthGuard } from "@/auth/guards/jwt-auth.guard";

@UseGuards(JWTAuthGuard)
@Controller("workplace/:workplaceId/task")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get("available")
  async findAvailableTasks(
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
  ): Promise<IFindAllTasksResponse> {
    const tasks = await this.taskService.findAvailableTasks(workplaceId);

    return {
      tasks,
    };
  }

  @Get("active")
  async findOwnedTasks(
    @AuthUser() user: User,
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
  ): Promise<IFindAllTasksResponse> {
    const tasks = await this.taskService.findActiveTasks(workplaceId, user);

    return {
      tasks,
    };
  }

  @Get(":taskId")
  async findOneTask(
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<IFindOneTaskResponse> {
    const task = await this.taskService.findTaskById(taskId);
    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return {
      task,
    };
  }

  @Post()
  async createTask(
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<ICreateTaskResponse> {
    const createdTask = await this.taskService.createTask(
      workplaceId,
      createTaskDto,
    );

    return {
      task: createdTask,
    };
  }

  @Patch(":taskId/claim")
  async claimTask(
    @AuthUser() user: User,
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<IUpdateTaskResponse> {
    const updatedTask = await this.taskService.assignTask(taskId, user);

    return {
      task: updatedTask,
    };
  }

  @Patch(":taskId/complete")
  async completeTask(
    @AuthUser() user: User,
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<IUpdateTaskResponse> {
    const updatedTask = await this.taskService.completeTask(taskId, user);

    return {
      task: updatedTask,
    };
  }

  @Patch(":taskId/cancel")
  async cancelTask(
    @AuthUser() user: User,
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<IUpdateTaskResponse> {
    const updatedTask = await this.taskService.cancelTask(taskId, user);

    return {
      task: updatedTask,
    };
  }

  @Patch(":taskId")
  async updateTask(
    @Param("taskId", ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<IUpdateTaskResponse> {
    const updatedTask = await this.taskService.updateTask(
      taskId,
      updateTaskDto,
    );
    if (!updatedTask) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    return {
      task: updatedTask,
    };
  }

  @Delete(":taskId")
  async deleteTask(
    @Param("taskId", ParseIntPipe) taskId: number,
  ): Promise<IDeleteTaskResponse> {
    await this.taskService.deleteTask(taskId);

    return {
      success: true,
      message: `Task with id ${taskId} has been deleted`,
    };
  }
}
