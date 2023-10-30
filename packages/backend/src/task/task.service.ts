import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/typeorm/entities/Task";
import { Repository } from "typeorm";
import { CreateTaskParams, UpdateTaskParams } from "./utils/types";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  //get all tasks
  findTasks() {
    return this.taskRepository.find();
  }

  //get task by id
  findTaskById(id: number) {
    return this.taskRepository.find({ where: { id } });
  }

  //create task
  async createTask(taskDetails: CreateTaskParams) {
    const newTask = this.taskRepository.create(taskDetails);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  //update task
  async updateTask(id: number, updateTask: UpdateTaskParams) {
    await this.taskRepository.update(id, updateTask);
    return this.taskRepository.find({ where: { id } });
  }

  //delete task
  async deleteTask(id: number) {
    await this.taskRepository.delete(id);
  }
}
