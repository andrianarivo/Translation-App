import { FileValidator } from '@nestjs/common';

export class JsonFileValidator extends FileValidator {
  constructor(options: Record<string, any> = {}) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean {
    if (!file.buffer) {
      return false;
    }

    if (!file.originalname.endsWith('.json')) {
      return false;
    }

    try {
      JSON.parse(file.buffer.toString());
      return true;
    } catch {
      return false;
    }
  }

  buildErrorMessage(): string {
    return 'File must contain valid JSON';
  }
}
