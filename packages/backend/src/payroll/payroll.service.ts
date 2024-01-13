import { BadRequestException, Injectable } from "@nestjs/common";
import { Task } from "@/entities/task.entity";
import { IsNull, Repository } from "typeorm";
import { CreatePayrollDto } from "./dtos/CreatePayroll.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/entities/user.entity";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { Payroll } from "@/entities/payroll.entity";

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(UserWorkplace)
    private userWorkplaceRepository: Repository<UserWorkplace>,
  ) {}

  async findPayrollsForUser(
    workplaceId: number,
    user: User,
  ): Promise<Payroll[]> {
    const payrolls = await this.payrollRepository.find({
      where: {
        workplace: { id: workplaceId },
        beneficiary: { id: user.id },
      },
      relations: ["createdBy"],
    });

    return payrolls;
  }

  async findPayroll(id: number, user: User): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: {
        id,
        beneficiary: { id: user.id },
      },
      relations: ["createdBy", "tasks"],
    });

    if (!payroll) {
      throw new BadRequestException("Payroll not found");
    }

    return payroll;
  }

  async previewPayroll(
    workplaceId: number,
    userId: number,
    user: User,
  ): Promise<Task[]> {
    const userWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        workplace: {
          id: workplaceId,
        },
        user: {
          id: user.id,
        },
      },
      relations: ["role"],
    });
    if (userWorkplace?.role.name !== "Operator") {
      throw new BadRequestException("User is not an operator");
    }

    const tasks = await this.taskRepository.find({
      where: {
        user: { id: userId },
        status: "Completed",
        payroll: IsNull(),
      },
    });
    return tasks;
  }

  async createPayroll(
    workplaceId: number,
    dto: CreatePayrollDto,
    user: User,
  ): Promise<Payroll> {
    const userWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        workplace: {
          id: workplaceId,
        },
        user: {
          id: user.id,
        },
      },
      relations: ["role"],
    });
    if (userWorkplace?.role.name !== "Operator") {
      throw new BadRequestException("User is not an operator");
    }

    const tasks = await this.taskRepository.find({
      where: {
        user: { id: dto.userId },
        status: "Completed",
        payroll: IsNull(),
      },
    });
    if (tasks.length === 0) {
      throw new BadRequestException("Tasks not found");
    }

    const total = tasks.reduce((acc, task) => acc + task.price, 0);

    const payroll = this.payrollRepository.create({
      createdBy: user,
      beneficiary: { id: dto.userId },
      workplace: { id: workplaceId },
      total,
      tasks,
    });
    return this.payrollRepository.save(payroll);
  }
}
