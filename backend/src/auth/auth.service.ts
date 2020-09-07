import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

interface ILoginUser {
  username: string,
  githubId: number,
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
  }

  async login(user: ILoginUser) {
    const payload = { username: user.username, sub: user.githubId };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
