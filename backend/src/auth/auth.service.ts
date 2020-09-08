import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayload, ILoginUser } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
  }

  async login(user: ILoginUser) {
    const payload: IJwtPayload = { id: user.id, sub: user.githubId };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
