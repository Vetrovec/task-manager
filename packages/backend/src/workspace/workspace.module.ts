import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { Workspace } from "src/entities/workspace.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
