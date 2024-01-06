import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { Workplace } from "@/entities/workplace.entity";
import { CreateWorkplaceDto } from "./dtos/CreateWorkplace.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/entities/user.entity";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { Role } from "@/entities/role.entity";
import { AddUserDto } from "./dtos/AddUser.dto";
import { Task } from "@/entities/task.entity";

@Injectable()
export class WorkplaceService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Workplace)
    private workplaceRepository: Repository<Workplace>,
    @InjectRepository(UserWorkplace)
    private userWorkplaceRepository: Repository<UserWorkplace>,
  ) {}

  async findForUser(user: User) {
    const userWorkplaces = await this.userWorkplaceRepository.find({
      where: { user: { id: user.id } },
      relations: ["workplace"],
    });

    return userWorkplaces.map((userWorkplace) => userWorkplace.workplace);
  }

  async getWorkplaceDetails(id: number, user: User) {
    const userWorkplace = await this.userWorkplaceRepository.findOne({
      where: { user: { id: user.id }, workplace: { id } },
      relations: ["workplace", "role"],
    });

    if (!userWorkplace?.workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }

    let userWorkplaces: UserWorkplace[] = [];
    if (userWorkplace.role.name === "Operator") {
      userWorkplaces = await this.userWorkplaceRepository.find({
        where: { workplace: { id } },
        relations: ["user", "role"],
      });
    }

    return {
      workplace: userWorkplace.workplace,
      users: userWorkplaces.map((userWorkplace) => ({
        user: userWorkplace.user,
        role: userWorkplace.role.name,
      })),
    };
  }

  async create(
    createWorkplaceDto: CreateWorkplaceDto,
    user: User,
  ): Promise<Workplace> {
    const role = await this.roleRepository.findOne({
      where: {
        name: "Operator",
      },
    });

    if (!role) {
      throw new InternalServerErrorException("Role not found");
    }

    const newWorkplace = this.workplaceRepository.create({
      name: createWorkplaceDto.name,
      text: createWorkplaceDto.text,
    });
    const workplace = await this.workplaceRepository.save(newWorkplace);

    const newUserWorkplace = this.userWorkplaceRepository.create({
      user,
      workplace,
      role,
    });
    await this.userWorkplaceRepository.save(newUserWorkplace);

    return workplace;
  }

  async addUser(id: number, addUserDto: AddUserDto, user: User) {
    const currentUserWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        user: { id: user.id },
        workplace: { id },
      },
      relations: ["role"],
    });
    if (currentUserWorkplace?.role.name !== "Operator") {
      throw new BadRequestException("User is not an operator");
    }

    const workplace = await this.workplaceRepository.findOne({
      where: { id },
    });
    if (!workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }

    const targetUser = await this.userRepository.findOne({
      where: { email: addUserDto.email },
    });
    if (!targetUser) {
      throw new NotFoundException(
        `User with email ${addUserDto.email} not found.`,
      );
    }

    const role = await this.roleRepository.findOne({
      where: { name: addUserDto.role },
    });
    if (!role) {
      throw new InternalServerErrorException("Role not found");
    }

    const newUserWorkplace = this.userWorkplaceRepository.create({
      user: targetUser,
      workplace,
      role,
    });
    await this.userWorkplaceRepository.save(newUserWorkplace);
  }

  async deleteUser(workplaceId: number, userId: number, user: User) {
    if (userId === user.id) {
      throw new BadRequestException("Cannot delete yourself");
    }

    const currentUserWorkplace = await this.userWorkplaceRepository.findOne({
      where: {
        user: { id: user.id },
        workplace: { id: workplaceId },
      },
      relations: ["role"],
    });
    if (currentUserWorkplace?.role.name !== "Operator") {
      throw new BadRequestException("User is not an operator");
    }

    await this.taskRepository.update(
      { user: { id: userId }, workplace: { id: workplaceId }, status: "Open" },
      { user: null },
    );

    const result = await this.userWorkplaceRepository.delete({
      user: { id: userId },
      workplace: { id: workplaceId },
    });
    if (result.affected === 0) {
      throw new NotFoundException("User not found");
    }
  }
}
