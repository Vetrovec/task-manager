import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "@/entities/task.entity";
import { WorkplaceModule } from "../workplace/workplace.module";
import { Workplace } from "@/entities/workplace.entity";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { AuditModule } from "../audit/audit.modules";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, UserWorkplace, Workplace]),
    WorkplaceModule,
    AuditModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
