import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from "./interfaces";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ConfigService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    return { githubUserId: payload.sub, id: payload.id };
  }
}
