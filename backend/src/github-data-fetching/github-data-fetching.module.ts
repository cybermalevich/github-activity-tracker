import { Module } from "@nestjs/common";
import { GithubDataFetchingService } from "./github-data-fetching.service";

@Module({
  providers: [GithubDataFetchingService],
  exports: [GithubDataFetchingService]
})
export class GithubDataFetchingModule {
}
