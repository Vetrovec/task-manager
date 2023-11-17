import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { SignUpDto } from "./dtos/SignUp.dto";
import { AuthService } from "./auth.service";
import { User } from "@/entities/user.entity";
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthUser } from "./decorators/user.decorator";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @UseInterceptors(TokenInterceptor)
  async signup(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signup(signUpDto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  async login(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Get("me")
  @UseGuards(JWTAuthGuard)
  async me(@AuthUser() user: User): Promise<User> {
    return user;
  }
}
