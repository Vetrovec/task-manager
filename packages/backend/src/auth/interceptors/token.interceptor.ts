import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { AuthService } from "../auth.service";
import type { User } from "@/entities/user.entity";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    return next.handle().pipe(
      mergeMap(async (user) => {
        const response = context.switchToHttp().getResponse();

        const token = await this.authService.signToken(user);

        response.setHeader("Authorization", `Bearer ${token}`);
        response.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
        });

        return user;
      }),
    );
  }
}
