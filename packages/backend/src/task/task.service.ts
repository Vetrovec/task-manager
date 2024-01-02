import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Task } from "@/entities/task.entity";
import { IsNull, Repository } from "typeorm";
import { CreateTaskDto } from "./dtos/CreateTask.dto";
import { UpdateTaskDto } from "./dtos/UpdateTask.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Workplace } from "@/entities/workplace.entity";
import { User } from "@/entities/user.entity";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Workplace)
    private workplaceRepository: Repository<Workplace>,
  ) {}

  findAvailableTasks(workplaceId: number) {
    return this.taskRepository.find({
      where: {
        workplace: { id: workplaceId },
        status: "Open",
        user: IsNull(),
      },
    });
  }

  findActiveTasks(workplaceId: number, user: User) {
    return this.taskRepository.find({
      where: {
        workplace: { id: workplaceId },
        status: "Open",
        user: {
          id: user.id,
        },
      },
    });
  }

  findTaskById(id: number) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async createTask(workplaceId: number, dto: CreateTaskDto) {
    const newTask = this.taskRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      status: "Open",
      workplace: { id: workplaceId },
    });
    await this.taskRepository.save(newTask);

    return newTask;
  }

  async updateTask(
    id: number,
    updateTask: UpdateTaskDto,
  ): Promise<Task | null> {
    await this.taskRepository.update(id, {
      name: updateTask.name,
      description: updateTask.description,
      price: updateTask.price,
      status: updateTask.status,
    });

    return this.taskRepository.findOne({ where: { id } });
  }

  async assignTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["user"],
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (task.user) {
      throw new BadRequestException("Task already assigned");
    }

    task.user = user;
    return this.taskRepository.save(task);
  }

  async completeTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["user"],
    });

    if (task?.user?.id !== user.id) {
      throw new NotFoundException("Task not found");
    }
    if (task.status !== "Open") {
      throw new BadRequestException("Task is not open");
    }

    task.status = "Completed";
    return this.taskRepository.save(task);
  }

  async cancelTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["user"],
    });

    if (task?.user?.id !== user.id) {
      throw new NotFoundException("Task not found");
    }

    task.status = "Cancelled";
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (task?.status !== "Open") {
      throw new BadRequestException("Task is not open");
    }

    await this.taskRepository.delete(id);
  }
}
