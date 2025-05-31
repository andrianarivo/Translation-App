import {
  Controller,
  UploadedFiles,
  Post,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JsonFileValidator } from '../validators/json-file.validator';

@Controller('translation')
export class TranslationController {
  @Post('json')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
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
    console.log('files', files);
    return { status: HttpStatus.CREATED };
  }
}
