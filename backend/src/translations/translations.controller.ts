import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JsonFileValidator } from '../validators/json-file.validator';
import { TranslationsService } from './translations.service';
import { validLocales } from '../utils/valid-locales';
import { UpdateContentDto } from './dto/UpdateContentDto';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post('import')
  @HttpCode(201)
  @UseInterceptors(FilesInterceptor('files'))
  async importFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 25 * 1024 * 1024,
        })
        .addValidator(new JsonFileValidator())
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
    // store files in the database
    const data = await Promise.all(
      files.map((file) =>
        this.translationsService.createTranslationFile({
          filename: file.originalname,
          content: file.buffer.toString(),
        }),
      ),
    );
    return { data };
  }

  @Get('parse')
  @HttpCode(200)
  async parseFiles(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: number[],
  ) {
    const translationFiles =
      await this.translationsService.translationFiles(ids);

    const allFilesParsed = translationFiles.reduce(
      (acc: boolean, translationFile) => acc && translationFile.parsed,
      true,
    );

    if (allFilesParsed) {
      throw new BadRequestException('All files are already parsed.');
    }

    const translations = await Promise.all(
      translationFiles.map((translationFile) =>
        this.translationsService.parseTranslationFile(translationFile),
      ),
    );

    await Promise.all(
      ids.map((id) => this.translationsService.toggleTranslationFileParsed(id)),
    );

    return translations;
  }

  @Get()
  @HttpCode(200)
  getTranslations(
    @Query('locales', new ParseArrayPipe({ items: String, separator: ',' }))
    locales: string[],
  ) {
    const allLocalesExist = locales.every((locale) =>
      validLocales.includes(locale),
    );

    if (!allLocalesExist) {
      throw new BadRequestException('Some locales are invalid.');
    }

    return this.translationsService.translations(locales);
  }

  @Get('locales')
  @HttpCode(200)
  getLocales() {
    return this.translationsService.locales();
  }

  @Delete('contents')
  @HttpCode(200)
  async deleteContents(
    @Query('keys', new ParseArrayPipe({ items: String, separator: ',' }))
    keys: string[],
  ) {
    if (!keys.length) {
      throw new BadRequestException('Keys array is empty');
    }
    const existingContents =
      await this.translationsService.getTranslationContents(keys);
    if (!existingContents)
      throw new BadRequestException(
        "Couldn't find any contents for given keys",
      );
    await this.translationsService.deleteTranslations(keys);
    return existingContents;
  }

  @Put('contents')
  @HttpCode(200)
  async updateContents(
    @Body(new ParseArrayPipe({ items: UpdateContentDto }))
    contentDtos: UpdateContentDto[],
  ) {
    if (contentDtos.length === 0) {
      throw new BadRequestException('No contents provided.');
    }

    return await Promise.all(
      contentDtos.map((contentDto) =>
        this.translationsService.updateTranslationContent(contentDto),
      ),
    );
  }
}
