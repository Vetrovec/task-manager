import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
} from "@nestjs/common";
import { CreateTaskDto } from "./dtos/CreateTask.dto";
import { TaskService } from "./task.service";
import { UpdateTaskDto } from "./dtos/UpdateTask.dto";
import { ParseIntPipe } from "@nestjs/common";

@Controller("task")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks() {
    return this.taskService.findTasks();
  }

  @Get(":id")
  findTaskById(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.findTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    const newTask = this.taskService.createTask(createTaskDto);
    return newTask;
  }

  @Put(":id")
  updateTask(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const updatedTask = this.taskService.updateTask(id, updateTaskDto);
    return updatedTask;
  }

  @Delete(":id")
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    this.taskService.deleteTask(id);
    return `Task with id ${id} has been deleted`;
  }
}
