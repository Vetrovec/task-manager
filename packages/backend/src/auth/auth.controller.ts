import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import type { Response } from "express";
import { SignUpDto } from "./dtos/SignUp.dto";
import { AuthService } from "./auth.service";
import { User } from "@/entities/user.entity";
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthUser } from "./decorators/user.decorator";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";
import { GoogleOauthGuard } from "./guards/google-oauth.guard";
import { ConfigService } from "@nestjs/config";
import { IGetMeResponse } from "@task-manager/shared";

@Controller("auth")
export class AuthController {
  private readonly oauthRedirectUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.oauthRedirectUrl = this.configService.getOrThrow("oauth.redirectUrl");
  }

  @Post("signup")
  @UseInterceptors(TokenInterceptor)
  async signup(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  async login(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Post("logout")
  @UseGuards(JWTAuthGuard)
  async logout(@Res() res: Response): Promise<void> {
    res.clearCookie("token");
    res.send();
  }

  @Get("me")
  @UseGuards(JWTAuthGuard)
  async me(@AuthUser() user: User): Promise<IGetMeResponse> {
    return { user };
  }

  @Get("google")
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get("google/callback")
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@AuthUser() user: User, @Res() response: Response) {
    await this.addTokenToResponse(response, user);
    response.redirect(this.oauthRedirectUrl);
  }

  private async addTokenToResponse(response: Response, user: User) {
    const token = await this.authService.signToken(user);

    response.setHeader("Authorization", `Bearer ${token}`);
    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
  }
}
