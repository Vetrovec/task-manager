import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TaskModule } from "./task/task.module";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { WorkplaceModule } from "./workplace/workplace.module";
import appConfig from "./config/app.config";
import { PayrollModule } from "./payroll/payroll.module";
import { AuditModule } from "./audit/audit.modules";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.getOrThrow("db.host"),
        port: configService.getOrThrow("db.port"),
        username: configService.getOrThrow("db.username"),
        password: configService.getOrThrow("db.password"),
        database: configService.getOrThrow("db.database"),
        entities: [join(__dirname, "./**/*.entity{.ts,.js}")],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PayrollModule,
    TaskModule,
    UserModule,
    WorkplaceModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
