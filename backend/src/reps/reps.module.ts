import { Module } from "@nestjs/common";
import { RepsController } from "./reps.controller";
import { RepsService } from "./reps.service";

@Module({
  controllers: [RepsController],
  providers: [RepsService],
  exports: [RepsService]
})
export class RepsModule {
}
