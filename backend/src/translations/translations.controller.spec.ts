import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsController } from './translations.controller';
import { HttpStatus } from '@nestjs/common';
import { TranslationsService } from './translations.service';

describe('TranslationsController', () => {
  let controller: TranslationsController;

  const mockTranslationsService = {
    createTranslationFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationsController],
      providers: [
        {
          provide: TranslationsService,
          useValue: mockTranslationsService,
        },
      ],
    }).compile();

    controller = module.get<TranslationsController>(TranslationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('importFiles', () => {
    it('should process and store files successfully', async () => {
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

      mockTranslationsService.createTranslationFile.mockResolvedValue({
        id: 1,
        filename: 'test',
        content: '{"test": "data"}',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.importFiles(mockFiles);

      expect(result.status).toBe(HttpStatus.CREATED);
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenCalledWith({
        filename: 'test',
        content: '{"test": "data"}',
      });
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenCalledTimes(1);
    });

    it('should process multiple files', async () => {
      const mockFiles: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'test1.json',
          encoding: '7bit',
          mimetype: 'application/json',
          size: 1024,
          buffer: Buffer.from('{"test1": "data1"}'),
          destination: '',
          filename: 'test1.json',
          path: '/tmp/test1.json',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          stream: null as any,
        },
        {
          fieldname: 'files',
          originalname: 'test2.json',
          encoding: '7bit',
          mimetype: 'application/json',
          size: 1024,
          buffer: Buffer.from('{"test2": "data2"}'),
          destination: '',
          filename: 'test2.json',
          path: '/tmp/test2.json',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          stream: null as any,
        },
      ];

      mockTranslationsService.createTranslationFile.mockResolvedValue({
        id: 1,
        filename: 'test',
        content: '{}',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.importFiles(mockFiles);

      expect(result.status).toBe(HttpStatus.CREATED);
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenNthCalledWith(1, {
        filename: 'test1',
        content: '{"test1": "data1"}',
      });
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenNthCalledWith(2, {
        filename: 'test2',
        content: '{"test2": "data2"}',
      });
    });
  });
});
