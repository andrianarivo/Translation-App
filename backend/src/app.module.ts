import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationController } from './translation/translation.controller';

@Module({
  imports: [],
  controllers: [AppController, ImportController],
  providers: [AppService],
  controllers: [AppController, TranslationController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
