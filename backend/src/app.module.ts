import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsController } from './translations/translations.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { TranslationsService } from './translations/translations.service';
import { OpenaiService } from './openai/openai.service';
import envSchema from './env-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
    }),
  ],
  controllers: [AppController, TranslationsController],
  providers: [AppService, PrismaService, TranslationsService, OpenaiService],
})
export class AppModule {}
