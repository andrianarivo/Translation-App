import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsController } from './translations.controller';
import { HttpStatus } from '@nestjs/common';

describe('TranslationsController', () => {
  let controller: TranslationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationsController],
    }).compile();

    controller = module.get<TranslationsController>(TranslationsController);
  });

  describe('uploadJSON', () => {
    it('should return 201 status code', () => {
      const mockFiles: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'test.json',
          encoding: '7bit',
          mimetype: 'application/json',
          size: 1024,
          buffer: Buffer.from('{"test": "data"}'),
          destination: '',
          filename: 'test.json',
          path: '/tmp/test.json',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          stream: null as any,
        },
      ];

      const result = controller.uploadFile(mockFiles);
      expect(result.status).toBe(HttpStatus.CREATED);
    });
  });
});
