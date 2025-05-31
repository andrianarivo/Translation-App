import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImportController } from './import/import.controller';

@Module({
  imports: [],
  controllers: [AppController, ImportController],
  providers: [AppService],
})
export class AppModule {}
