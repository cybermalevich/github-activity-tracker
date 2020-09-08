import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UsersController} from "./users/users.controller";
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import { RepsModule } from './reps/reps.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from "./auth/auth.controller";
import { RepsController } from "./reps/reps.controller";
import { GithubDataFetchingModule } from './github-data-fetching/github-data-fetching.module';
import { RepEventsModule } from './rep-events/rep-events.module';
import { CreationalJobsModule } from "./creational-jobs/creational-jobs.module";
import { CreationalJobsController } from "./creational-jobs/creational-jobs.controller";

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, ConfigModule.forRoot({
    isGlobal: true,
    expandVariables: true,
  }), RepsModule, AuthModule, GithubDataFetchingModule, RepEventsModule, CreationalJobsModule],
  controllers: [AppController, UsersController, RepsController, AuthController, CreationalJobsController ],
  providers: [AppService],
})
export class AppModule {}
