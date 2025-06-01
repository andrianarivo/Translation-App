import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Translation, TranslationFile } from '../../generated/prisma';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  async createTranslationFile(
    data: Prisma.TranslationFileCreateInput,
  ): Promise<TranslationFile> {
    return this.prisma.translationFile.create({
      data,
    });
  }

  // async parseTranslationFile(ids: number[]): Promise<Translation> {
  //
  // }
}
