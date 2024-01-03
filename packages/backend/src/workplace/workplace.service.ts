import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { Workplace } from "@/entities/workplace.entity";
import { CreateWorkplaceDto } from "./dtos/CreateWorkplace.dto";
import { UpdateWorkplaceDto } from "./dtos/UpdateWorkplace.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/entities/user.entity";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { Role } from "@/entities/role.entity";

@Injectable()
export class WorkplaceService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Workplace)
    private workplaceRepository: Repository<Workplace>,
    @InjectRepository(UserWorkplace)
    private userWorkplaceRepository: Repository<UserWorkplace>,
  ) {}

  async findAll(user: User): Promise<Workplace[]> {
    const userWorkplaces = await this.userWorkplaceRepository.find({
      where: { user: { id: user.id } },
      relations: ["workplace"],
    });

    return userWorkplaces.map((userWorkplace) => userWorkplace.workplace);
  }

  async findOne(id: number, user: User): Promise<Workplace> {
    const userWorkplaces = await this.userWorkplaceRepository.findOne({
      where: { user: { id: user.id }, workplace: { id } },
      relations: ["workplace"],
    });

    if (!userWorkplaces?.workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }

    return userWorkplaces.workplace;
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

  async update(
    id: number,
    updateWorkplaceDto: UpdateWorkplaceDto,
    user: User,
  ): Promise<Workplace> {
    const workplace = await this.findOne(id, user);
    if (!workplace) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }

    await this.workplaceRepository.update(id, {
      name: updateWorkplaceDto.name,
      text: updateWorkplaceDto.text,
    });
    return this.workplaceRepository.save(workplace);
  }

  async delete(id: number): Promise<void> {
    const result = await this.workplaceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Workplace with ID ${id} not found.`);
    }
  }
}
