import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Translation, TranslationFile } from '../../generated/prisma';
import { flattenObject } from '../utils/flatten-object.util';

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

  async translations(ids: number[]): Promise<Translation[]> {
    return this.prisma.translation.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async translationFiles(ids: number[]): Promise<TranslationFile[]> {
    return this.prisma.translationFile.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async parseTranslationFile(data: TranslationFile): Promise<Translation> {
    const flatObjects = flattenObject(JSON.parse(data.content));

    let translation = await this.prisma.translation.findFirst({
      where: {
        name: data.filename.split('.')[0],
      },
    });

    if (!translation) {
      translation = await this.prisma.translation.create({
        data: {
          name: data.filename.split('.')[0],
          version: 0,
        },
      });
    }

    await this.prisma.content.createMany({
      data: Object.entries(flatObjects).map(([key, value]) => ({
        key,
        value,
        translationId: translation.id,
      })),
    });

    return translation;
  }

  async toggleTranslationFileParsed(id: number): Promise<TranslationFile> {
    const translationFile = await this.prisma.translationFile.findUnique({
      where: {
        id,
      },
    });

    if (!translationFile) {
      throw new Error('Translation file not found');
    }

    return this.prisma.translationFile.update({
      where: {
        id,
      },
      data: {
        parsed: !translationFile.parsed,
      },
    });
  }
}
