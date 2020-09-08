import {Module} from '@nestjs/common';
import {CreationalJobsService} from './creational-jobs.service';
import {CreationalJobsController} from './creational-jobs.controller';
import { GithubDataFetchingModule } from "../github-data-fetching/github-data-fetching.module";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { RepsModule } from "../reps/reps.module";
import { RepEventsModule } from "../rep-events/rep-events.module";

@Module({
    providers: [CreationalJobsService],
    controllers: [CreationalJobsController],
    imports: [AuthModule, GithubDataFetchingModule, UsersModule, RepsModule, RepEventsModule],
    exports: [CreationalJobsService]
})
export class CreationalJobsModule {
}
