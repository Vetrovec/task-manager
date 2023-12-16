import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "@/entities/task.entity";
import { Repository } from "typeorm";
import { ITask } from "@task-manager/shared";
import { Workplace } from "@/entities/workplace.entity";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Workplace)
    private workplaceRepository: Repository<Workplace>,
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

  async assignWorkplace(taskId: number, workplaceId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["workplace"],
    });
    if (!task) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    const workplace = await this.workplaceRepository.findOne({
      where: { id: workplaceId },
    });
    if (!workplace) {
      throw new HttpException("Workplace not found", HttpStatus.NOT_FOUND);
    }

    task.workplace = workplace;
    return this.taskRepository.save(task);
  }
}
