import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
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

@Controller("task")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async findAllTasks(): Promise<IFindAllTasksResponse> {
    const tasks = await this.taskService.findTasks();
    return {
      tasks,
    };
  }

  @Get(":id")
  async findOneTask(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<IFindOneTaskResponse> {
    const task = await this.taskService.findTaskById(id);
    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    return {
      task,
    };
  }

  @Post()
  async createTask(
    @Body() createTaskRequest: CreateTaskDto,
  ): Promise<ICreateTaskResponse> {
    const createdTask = await this.taskService.createTask(createTaskRequest);
    return {
      task: createdTask,
    };
  }

  @Put(":id")
  async updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskRequest: UpdateTaskDto,
  ): Promise<IUpdateTaskResponse> {
    const updatedTask = await this.taskService.updateTask(
      id,
      updateTaskRequest,
    );
    if (!updatedTask) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    return {
      task: updatedTask,
    };
  }

  @Delete(":id")
  async deleteTask(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<IDeleteTaskResponse> {
    const deleteTaskResult = await this.taskService.deleteTask(id);
    // TODO: Provide correct reasons for failure
    if (!deleteTaskResult) {
      return {
        success: false,
        message: `Task with id ${id} is open and cannot be deleted`,
      };
    }
    return {
      success: deleteTaskResult,
      message: `Task with id ${id} has been deleted`,
    };
  }
}
