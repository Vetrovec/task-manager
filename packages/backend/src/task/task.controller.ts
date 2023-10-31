import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { CreateTaskDto } from "./dtos/task/CreateTask.dto";
import { TaskService } from "./task.service";
import { UpdateTaskDto } from "./dtos/task/UpdateTask.dto";

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
    const deleteTaskMessage = this.taskService.deleteTask(id);
    return deleteTaskMessage;
  }
}
