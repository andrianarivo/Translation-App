import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TranslationFile } from '../../generated/prisma';

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
}
