import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationController } from './translation/translation.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import envSchema from './env-schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
    }),
  ],
  controllers: [AppController, TranslationController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
