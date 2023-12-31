import * as bcrypt from "bcryptjs";
import { User } from "@/entities/user.entity";
import { UserService } from "@/user/user.service";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { SignUpDto } from "./dtos/SignUp.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { OauthProfile } from "./interfaces/oauth-profile.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async oauthLogin(profile: OauthProfile): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(profile.email);
    if (existingUser) {
      return existingUser;
    }

    const userData = {
      displayName: profile.displayName,
      email: profile.email,
    };
    const user = await this.userService.create(userData);

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    if (!user?.passwordHash) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(signUpDto.email);
    if (existingUser) {
      throw new BadRequestException();
    }

    const passwordHash = await bcrypt.hash(signUpDto.password, 10);
    const userData = {
      displayName: signUpDto.displayName,
      email: signUpDto.email,
      passwordHash,
    };
    const user = await this.userService.create(userData);

    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOneById(parseInt(payload.sub, 10));

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async signToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };

    return await this.jwtService.signAsync(payload);
  }
}
