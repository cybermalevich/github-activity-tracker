import { Module } from '@nestjs/common';
import { RepsController } from './reps.controller';

@Module({
  controllers: [RepsController]
})
export class RepsModule {}
