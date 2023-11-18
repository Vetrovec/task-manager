import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow("google.clientID"),
      clientSecret: configService.getOrThrow("google.clientSecret"),
      callbackURL: configService.getOrThrow("google.callbackURL"),
      scope: ["profile", "email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails } = profile;
    const [email] = emails;

    if (!email?.verified) {
      done(new Error("Email not verified"));
    }

    try {
      const user = await this.authService.oauthLogin({
        displayName,
        email: email.value,
      });

      done(null, user);
    } catch {
      done(new Error("Something went wrong"));
    }
  }
}
