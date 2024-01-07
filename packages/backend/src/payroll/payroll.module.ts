import { Module } from "@nestjs/common";
import { PayrollController } from "./payroll.controller";
import { PayrollService } from "./payroll.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "@/entities/task.entity";
import { WorkplaceModule } from "../workplace/workplace.module";
import { Workplace } from "@/entities/workplace.entity";
import { UserWorkplace } from "@/entities/user-workplace.entity";
import { Payroll } from "@/entities/payroll.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Task, UserWorkplace, Workplace]),
    WorkplaceModule,
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
