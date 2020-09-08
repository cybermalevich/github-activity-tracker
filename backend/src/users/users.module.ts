import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { GithubDataFetchingModule } from "../github-data-fetching/github-data-fetching.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [AuthModule, GithubDataFetchingModule],
  exports: [UsersService]
})
export class UsersModule {
}
