import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UsersController} from "./users/users.controller";
import {GithubAuthController} from "./github-auth/github-auth.controller";
import {GithubAuthModule} from "./github-auth/github-auth.module";
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import { RepsModule } from './reps/reps.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from "./auth/auth.controller";
import { RepsController } from "./reps/reps.controller";

@Module({
  imports: [TypeOrmModule.forRoot(), GithubAuthModule, UsersModule, ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
  }), RepsModule, AuthModule],
  controllers: [AppController, GithubAuthController, UsersController, RepsController, AuthController ],
  providers: [AppService],
})
export class AppModule {}
