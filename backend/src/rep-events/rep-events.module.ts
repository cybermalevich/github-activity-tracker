import { Module } from "@nestjs/common";
import { RepEventsService } from "./rep-events.service";
import { GithubDataFetchingModule } from "../github-data-fetching/github-data-fetching.module";

@Module({
  imports: [GithubDataFetchingModule],
  providers: [RepEventsService],
  exports: [RepEventsService]
})
export class RepEventsModule {
}
