import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Task } from "@/entities/task.entity";
import { IsNull, Repository } from "typeorm";
import { CreateTaskDto } from "./dtos/CreateTask.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/entities/user.entity";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { AuditService } from "../audit/audit.service";
import { CreateAuditDto } from "../audit/dtos/CreateAudit.dto";
import { ActionTypeEnum } from "../audit/ActionTypeEnum";
import { EntityEnum } from "../audit/EntityEnum";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(UserWorkplace)
    private userWorkplaceRepository: Repository<UserWorkplace>,
    private auditService: AuditService,
  ) {}

  async findAvailableTasks(workplaceId: number, user: User) {
    const userWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        user: { id: user.id },
        workplace: { id: workplaceId },
      },
    });

    if (!userWorkplace) {
      throw new BadRequestException("User is not a member of this workplace");
    }

    return this.taskRepository.find({
      where: {
        workplace: { id: workplaceId },
        status: "Open",
        user: IsNull(),
      },
    });
  }

  async findActiveTasks(workplaceId: number, user: User) {
    return this.taskRepository.find({
      where: {
        user: {
          id: user.id,
        },
        workplace: { id: workplaceId },
        status: "Open",
      },
    });
  }

  async findCompletedTasks(workplaceId: number, user: User) {
    return this.taskRepository.find({
      where: {
        user: {
          id: user.id,
        },
        workplace: { id: workplaceId },
        status: "Completed",
        payroll: IsNull(),
      },
    });
  }

  async findTaskById(taskId: number) {
    return this.taskRepository.findOne({ where: { id: taskId } });
  }

  async createTask(workplaceId: number, dto: CreateTaskDto, user: User) {
    const userWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        user: { id: user.id },
        workplace: { id: workplaceId },
      },
      relations: ["role"],
    });

    if (userWorkplace?.role.name !== "Operator") {
      throw new BadRequestException("User is not an operator");
    }

    const newTask = this.taskRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      status: "Open",
      workplace: { id: workplaceId },
    });
    await this.taskRepository.save(newTask);

    const auditDto = new CreateAuditDto();
    auditDto.userId = user.id;
    auditDto.entity = EntityEnum.WORKPLACE;
    auditDto.entityId = workplaceId;
    auditDto.relations = { taskId: newTask.id };
    auditDto.actionType = ActionTypeEnum.CREATE;
    auditDto.description = `Task ${newTask.name} created`;
    auditDto.data = newTask;
    await this.auditService.createAuditRecord(auditDto);

    return newTask;
  }

  async assignTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["user", "workplace"],
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }
    if (task.user) {
      throw new BadRequestException("Task already assigned");
    }

    task.user = user;
    const res = await this.taskRepository.save(task);

    const auditDto = new CreateAuditDto();
    auditDto.userId = user.id;
    auditDto.entity = EntityEnum.WORKPLACE;
    auditDto.entityId = task.workplace.id;
    auditDto.relations = { taskId: task.id };
    auditDto.actionType = ActionTypeEnum.ASSIGN;
    auditDto.description = `Task ${task.name} assigned to ${user.email}`;
    auditDto.data = task;
    await this.auditService.createAuditRecord(auditDto);

    return res;
  }

  async completeTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: user.id } },
      relations: ["user", "workplace"],
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }
    if (task.status !== "Open") {
      throw new BadRequestException("Task is not open");
    }

    task.status = "Completed";
    const res = this.taskRepository.save(task);

    const auditDto = new CreateAuditDto();
    auditDto.userId = user.id;
    auditDto.entity = EntityEnum.WORKPLACE;
    auditDto.entityId = task.workplace.id;
    auditDto.relations = { taskId: task.id };
    auditDto.actionType = ActionTypeEnum.COMPLETE;
    auditDto.description = `Task ${task.name} completed`;
    auditDto.data = task;
    await this.auditService.createAuditRecord(auditDto);

    return res;
  }

  async cancelTask(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: user.id } },
      relations: ["user", "workplace"],
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }
    if (task.status !== "Open") {
      throw new BadRequestException("Task is not open");
    }

    task.user = null;
    const res = this.taskRepository.save(task);
    const auditDto = new CreateAuditDto();
    auditDto.userId = user.id;
    auditDto.entity = EntityEnum.WORKPLACE;
    auditDto.entityId = task.workplace.id;
    auditDto.relations = { taskId: task.id };
    auditDto.actionType = ActionTypeEnum.CANCEL;
    auditDto.description = `Task ${task.name} cancelled`;
    auditDto.data = task;
    await this.auditService.createAuditRecord(auditDto);

    return res;
  }

  async deleteTask(taskId: number, user: User): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ["workplace"],
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    const userWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        user: { id: user.id },
        workplace: { id: task.workplace.id },
      },
      relations: ["role"],
    });

    if (userWorkplace?.role.name !== "Operator") {
      throw new BadRequestException("User is not an operator");
    }
    if (task?.status !== "Open") {
      throw new BadRequestException("Task is not open");
    }
    const res = await this.taskRepository.delete({ id: taskId });
    const auditDto = new CreateAuditDto();
    auditDto.userId = user.id;
    auditDto.entity = EntityEnum.WORKPLACE;
    auditDto.entityId = task.workplace.id;
    auditDto.relations = { taskId: task.id };
    auditDto.actionType = ActionTypeEnum.DELETE;
    auditDto.description = `Task ${task.name} deleted`;
    auditDto.data = task;
    await this.auditService.createAuditRecord(auditDto);
  }
}
