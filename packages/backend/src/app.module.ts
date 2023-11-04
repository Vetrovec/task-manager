import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./config/app.config";

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
        entities: [],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
