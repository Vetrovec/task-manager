import {
  Body,
  Controller,
  Param,
  Post,
  ParseIntPipe,
  UseGuards,
  Get,
  Query,
} from "@nestjs/common";
import {
  ICreatePayrollResponse,
  IFindAllPayrollResponse,
  IFindOnePayrollResponse,
  IPreviewPayrollResponse,
} from "@task-manager/shared";
import { PayrollService } from "./payroll.service";
import { CreatePayrollDto } from "./dtos/CreatePayroll.dto";
import { AuthUser } from "@/auth/decorators/user.decorator";
import { User } from "@/entities/user.entity";
import { JWTAuthGuard } from "@/auth/guards/jwt-auth.guard";

@UseGuards(JWTAuthGuard)
@Controller("workplace/:workplaceId/payroll")
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Get()
  async findPayrolls(
    @AuthUser() user: User,
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
  ): Promise<IFindAllPayrollResponse> {
    const payrolls = await this.payrollService.findPayrollsForUser(
      workplaceId,
      user,
    );

    return {
      payrolls,
    };
  }

  @Get("preview")
  async previewPayroll(
    @AuthUser() user: User,
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
    @Query("userId", ParseIntPipe) userId: number,
  ): Promise<IPreviewPayrollResponse> {
    const tasks = await this.payrollService.previewPayroll(
      workplaceId,
      userId,
      user,
    );

    return {
      tasks,
    };
  }

  @Get(":payrollId")
  async findOnePayroll(
    @AuthUser() user: User,
    @Param("payrollId", ParseIntPipe) payrollId: number,
  ): Promise<IFindOnePayrollResponse> {
    const payroll = await this.payrollService.findPayroll(payrollId, user);

    return {
      payroll,
      tasks: payroll.tasks,
    };
  }

  @Post()
  async createPayroll(
    @AuthUser() user: User,
    @Param("workplaceId", ParseIntPipe) workplaceId: number,
    @Body() createPayrollDto: CreatePayrollDto,
  ): Promise<ICreatePayrollResponse> {
    const createdPayroll = await this.payrollService.createPayroll(
      workplaceId,
      createPayrollDto,
      user,
    );

    return {
      payroll: createdPayroll,
      tasks: createdPayroll.tasks,
    };
  }
}
