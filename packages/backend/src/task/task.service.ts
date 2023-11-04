import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/entities/task.entity";
import { Repository } from "typeorm";
import { CreateTaskParams, UpdateTaskParams } from "../utils/types";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  findTasks() {
    return this.taskRepository.find();
  }

  findTaskById(id: number) {
    return this.taskRepository.find({ where: { id } });
  }

  async createTask(taskDetails: CreateTaskParams) {
    const newTask = this.taskRepository.create(taskDetails);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async updateTask(id: number, updateTask: UpdateTaskParams) {
    await this.taskRepository.update(id, updateTask);
    return this.taskRepository.find({ where: { id } });
  }

  async deleteTask(id: number) {
    const task = await this.taskRepository.find({ where: { id } });
    const status = task[0].status;
    if (status == "open") {
      return `Task with id ${id} is open and cannot be deleted`;
    } else {
      await this.taskRepository.delete(id);
      return `Task with id ${id} has been deleted`;
    }
  }
}
