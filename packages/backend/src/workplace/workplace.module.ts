import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workplace } from "@/entities/workplace.entity";
import { WorkplaceController } from "./workplace.controller";
import { WorkplaceService } from "./workplace.service";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { Role } from "@/entities/role.entity";
import { User } from "@/entities/user.entity";
import { Task } from "@/entities/task.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Task, User, UserWorkplace, Workplace]),
  ],
  controllers: [WorkplaceController],
  providers: [WorkplaceService],
})
export class WorkplaceModule {}
