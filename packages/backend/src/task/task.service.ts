import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "@/entities/task.entity";
import { Repository } from "typeorm";
import { ITask } from "@task-manager/shared";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  findTasks() {
    return this.taskRepository.find();
  }

  findTaskById(id: number) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async createTask(taskDetails: Omit<ITask, "id">) {
    const newTask = this.taskRepository.create(taskDetails);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async updateTask(
    id: number,
    updateTask: Partial<ITask>,
  ): Promise<Task | null> {
    await this.taskRepository.update(id, updateTask);
    return this.taskRepository.findOne({ where: { id } });
  }

  async deleteTask(id: number): Promise<boolean> {
    const task = await this.taskRepository.find({ where: { id } });
    const status = task[0].status;
    if (status === "open") {
      return false;
    }
    await this.taskRepository.delete(id);
    return true;
  }
}
