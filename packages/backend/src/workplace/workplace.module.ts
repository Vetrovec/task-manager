import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workplace } from "@/entities/workplace.entity";
import { WorkplaceController } from "./workplace.controller";
import { WorkplaceService } from "./workplace.service";

@Module({
  imports: [TypeOrmModule.forFeature([Workplace])],
  controllers: [WorkplaceController],
  providers: [WorkplaceService],
})
export class WorkplaceModule {}
