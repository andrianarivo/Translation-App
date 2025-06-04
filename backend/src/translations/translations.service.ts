import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Content,
  Prisma,
  Translation,
  TranslationFile,
} from '../../generated/prisma';
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

  async translations(languages: string[]) {
    const translationIds = languages
      .map(
        (lang, index) =>
          `s${index + 1}.translation_id AS "translation_id%${lang}"`,
      )
      .join(', \n');

    const contentIds = languages
      .map((lang, index) => `s${index + 1}.content_id AS "content_id%${lang}"`)
      .join(', \n');

    const values = languages
      .map(
        (lang, index) => `
        CASE
          WHEN s${index + 1}.value IS NULL THEN ''
          WHEN s${index + 1}.value IS NOT NULL THEN s${index + 1}.value
        END AS "${lang}"`,
      )
      .join(', \n');

    let keys = 'CASE\n';
    keys = keys.concat(
      languages
        .map(
          (lang, index) =>
            `\nWHEN s${index + 1}.key IS NOT NULL THEN s${index + 1}.key`,
        )
        .join('\n'),
    );
    keys = keys.concat('\nEND as key');

    let tables = '';
    for (let i = 0; i < languages.length; i += 1) {
      const lang = languages[i];
      tables = tables.concat(`
      (SELECT t.id AS translation_id,
        c.id AS content_id,
        c.key,
        c.value,
        t.name AS "${lang}"
      FROM translations t 
      JOIN contents c 
      ON c.translation_id = t.id
      WHERE t.name = '${lang}') s${i + 1}`);
      if (i >= 1) {
        tables = tables.concat(`\n\tON s1.key = s${i + 1}.key`);
      }
      if (i !== languages.length - 1) {
        tables = tables.concat(`\n\tFULL OUTER JOIN`);
      }
    }

    return this.prisma.$queryRawUnsafe(
      `SELECT ${translationIds}, ${contentIds}, ${keys}, ${values} FROM ${tables}`,
    );
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

  async locales(): Promise<string[]> {
    const translations = await this.prisma.translation.findMany({
      select: {
        name: true,
      },
    });
    return translations.map((translation) => translation.name);
  }

  async deleteTranslations(keys: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.content.deleteMany({
      where: {
        key: {
          in: keys,
        },
      },
    });
  }

  async getTranslationContents(keys: string[]): Promise<Content[]> {
    return this.prisma.content.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });
  }

  async updateTranslationContent({
    id,
    key,
    value,
    locale,
  }: {
    id?: number;
    key: string;
    value?: string;
    locale?: string;
  }): Promise<Content> {
    const translation = await this.prisma.translation.findFirst({
      where: {
        name: locale,
      },
    });
    if (!translation) {
      throw new Error('Locale not found');
    }
    return this.prisma.content.upsert({
      where: {
        id,
      },
      create: {
        key,
        value,
        translationId: translation.id,
      },
      update: {
        key,
        value,
      },
    });
  }

  async createTranslationContent({
    key,
    value,
    locale,
  }: {
    key: string;
    value: string;
    locale: string;
  }): Promise<Content> {
    const translation = await this.prisma.translation.findFirst({
      where: {
        name: locale,
      },
    });
    if (!translation) {
      throw new Error('Locale not found');
    }
    return this.prisma.content.create({
      data: {
        key,
        value,
        translationId: translation.id,
      },
    });
  }
}
