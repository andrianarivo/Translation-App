import {
  Controller,
  UploadedFiles,
  Post,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Get,
  Query, HttpCode,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JsonFileValidator } from '../validators/json-file.validator';
import { TranslationsService } from './translations.service';

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
  parseFiles(@Query('id') ids: number[]) {
    console.log(ids);
    return;
  }
}
