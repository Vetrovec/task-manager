import { GetStatusResponse } from "@task-manager/shared";
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/status")
  getStatus(): GetStatusResponse {
    return { status: this.appService.getStatus() };
  }
}
