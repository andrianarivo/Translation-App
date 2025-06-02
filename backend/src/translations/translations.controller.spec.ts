import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';
import { Prisma } from '../../generated/prisma';
import { BadRequestException } from '@nestjs/common';

describe('TranslationsController', () => {
  let controller: TranslationsController;

  const mockTranslationsService = {
    translationFiles: jest.fn(),
    parseTranslationFile: jest.fn(),
    toggleTranslationFileParsed: jest.fn(),
    createTranslationFile: jest.fn(),
    translations: jest.fn(),
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

      const mockResponse = {
        id: 1,
        filename: 'test',
        content: '{"test": "data"}',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTranslationsService.createTranslationFile.mockResolvedValue(
        mockResponse,
      );

      const result = await controller.importFiles(mockFiles);

      expect(result).toEqual({ data: [mockResponse] });
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenCalledWith({
        filename: 'test.json',
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

      mockTranslationsService.createTranslationFile.mockImplementation(
        (input: Prisma.TranslationFileCreateInput) => ({
          id: input.filename === 'test1.json' ? 1 : 2,
          filename: input.filename,
          content: input.content,
        }),
      );

      const result = await controller.importFiles(mockFiles);

      expect(result.data).toHaveLength(2);
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenNthCalledWith(1, {
        filename: 'test1.json',
        content: '{"test1": "data1"}',
      });
      expect(
        mockTranslationsService.createTranslationFile,
      ).toHaveBeenNthCalledWith(2, {
        filename: 'test2.json',
        content: '{"test2": "data2"}',
      });
    });
  });

  describe('parseFiles', () => {
    it('should throw BadRequestException when all files are already parsed', async () => {
      const ids = [1, 2];
      const mockTranslationFiles = [
        {
          id: 1,
          filename: 'test1.json',
          content: '{"key1": "value1"}',
          parsed: true,
        },
        {
          id: 2,
          filename: 'test2.json',
          content: '{"key2": "value2"}',
          parsed: true,
        },
      ];

      mockTranslationsService.translationFiles.mockResolvedValue(
        mockTranslationFiles,
      );

      await expect(controller.parseFiles(ids)).rejects.toThrow(
        new BadRequestException('All files are already parsed.'),
      );

      expect(mockTranslationsService.translationFiles).toHaveBeenCalledWith(
        ids,
      );
      expect(
        mockTranslationsService.parseTranslationFile,
      ).not.toHaveBeenCalled();
      expect(
        mockTranslationsService.toggleTranslationFileParsed,
      ).not.toHaveBeenCalled();
    });

    it('should parse files and toggle their parsed status', async () => {
      const ids = [1, 2];
      const mockTranslationFiles = [
        {
          id: 1,
          filename: 'test1.json',
          content: '{"key1": "value1"}',
          parsed: false,
        },
        {
          id: 2,
          filename: 'test2.json',
          content: '{"key2": "value2"}',
          parsed: false,
        },
      ];
      const mockParsedTranslations = [
        { id: 1, name: 'test1', version: 0 },
        { id: 2, name: 'test2', version: 0 },
      ];
      const mockToggledFiles = mockTranslationFiles.map((file) => ({
        ...file,
        parsed: true,
      }));

      mockTranslationsService.translationFiles.mockResolvedValue(
        mockTranslationFiles,
      );
      mockTranslationsService.parseTranslationFile.mockImplementation((file) =>
        Promise.resolve(
          mockParsedTranslations.find(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            (t) => t.name === file.filename.split('.')[0],
          ),
        ),
      );
      mockTranslationsService.toggleTranslationFileParsed.mockImplementation(
        (id) =>
          Promise.resolve(mockToggledFiles.find((file) => file.id === id)),
      );

      const result = await controller.parseFiles(ids);

      expect(mockTranslationsService.translationFiles).toHaveBeenCalledWith([
        1, 2,
      ]);
      expect(
        mockTranslationsService.parseTranslationFile,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockTranslationsService.parseTranslationFile,
      ).toHaveBeenNthCalledWith(1, mockTranslationFiles[0]);
      expect(
        mockTranslationsService.parseTranslationFile,
      ).toHaveBeenNthCalledWith(2, mockTranslationFiles[1]);
      expect(
        mockTranslationsService.toggleTranslationFileParsed,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockTranslationsService.toggleTranslationFileParsed,
      ).toHaveBeenNthCalledWith(1, 1);
      expect(
        mockTranslationsService.toggleTranslationFileParsed,
      ).toHaveBeenNthCalledWith(2, 2);
      expect(result).toEqual(mockParsedTranslations);
    });

    it('should handle parsing errors gracefully', async () => {
      const ids = [1];
      const mockTranslationFiles = [
        {
          id: 1,
          filename: 'test1.json',
          content: '{"key1": "value1"}',
          parsed: false,
        },
      ];

      mockTranslationsService.translationFiles.mockResolvedValue(
        mockTranslationFiles,
      );
      mockTranslationsService.parseTranslationFile.mockRejectedValue(
        new Error('Parse error'),
      );
      mockTranslationsService.toggleTranslationFileParsed.mockResolvedValue({
        ...mockTranslationFiles[0],
        parsed: true,
      });

      await expect(controller.parseFiles(ids)).rejects.toThrow('Parse error');

      expect(mockTranslationsService.translationFiles).toHaveBeenCalledWith([
        1,
      ]);
      expect(mockTranslationsService.parseTranslationFile).toHaveBeenCalledWith(
        mockTranslationFiles[0],
      );
      // We should verify that toggleTranslationFileParsed is not called when parsing fails
      expect(
        mockTranslationsService.toggleTranslationFileParsed,
      ).not.toHaveBeenCalled();
    });
  });

  describe('getTranslations', () => {
    it('should return translations for valid locales', async () => {
      const locales = ['en-US', 'fr-FR'];
      const mockTranslations = [
        { key: 'hello', en: 'Hello', fr: 'Bonjour' },
        { key: 'goodbye', en: 'Goodbye', fr: 'Au revoir' },
      ];

      mockTranslationsService.translations.mockResolvedValue(mockTranslations);

      const result = await controller.getTranslations(locales);

      expect(mockTranslationsService.translations).toHaveBeenCalledWith(
        locales,
      );
      expect(result).toEqual(mockTranslations);
    });

    it('should throw BadRequestException for invalid locales', async () => {
      const locales = ['en', 'invalid'];

      try {
        await controller.getTranslations(locales);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }

      expect(mockTranslationsService.translations).not.toHaveBeenCalled();
    });

    it('should handle empty locales array', async () => {
      const locales: string[] = [];
      const mockTranslations = [];

      mockTranslationsService.translations.mockResolvedValue(mockTranslations);

      const result = await controller.getTranslations(locales);

      expect(mockTranslationsService.translations).toHaveBeenCalledWith(
        locales,
      );
      expect(result).toEqual(mockTranslations);
    });
  });
});
