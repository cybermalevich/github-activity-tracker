import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UsersController} from "./users/users.controller";
import {GithubAuthController} from "./github-auth/github-auth.controller";
import {GithubAuthModule} from "./github-auth/github-auth.module";
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forRoot(), GithubAuthModule, UsersModule, ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
  })],
  controllers: [AppController, GithubAuthController, UsersController],
  providers: [AppService],
})
export class AppModule {}
