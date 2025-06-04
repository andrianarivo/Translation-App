import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';
import { Prisma } from '../../generated/prisma';
import { BadRequestException } from '@nestjs/common';
import { UpdateContentDto } from './dto/UpdateContentDto';

describe('TranslationsController', () => {
  let controller: TranslationsController;

  const mockTranslationsService = {
    translationFiles: jest.fn(),
    parseTranslationFile: jest.fn(),
    toggleTranslationFileParsed: jest.fn(),
    createTranslationFile: jest.fn(),
    translations: jest.fn(),
    getTranslationContents: jest.fn(),
    deleteTranslations: jest.fn(),
    locales: jest.fn(),
    updateTranslationContent: jest.fn(),
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

  describe('getLocales', () => {
    it('should return array of locales', async () => {
      const mockLocales = ['en', 'fr', 'de'];
      mockTranslationsService.locales.mockResolvedValue(mockLocales);

      const result = await controller.getLocales();

      expect(mockTranslationsService.locales).toHaveBeenCalled();
      expect(result).toEqual(mockLocales);
    });

    it('should return empty array when no locales available', async () => {
      mockTranslationsService.locales.mockResolvedValue([]);

      const result = await controller.getLocales();

      expect(mockTranslationsService.locales).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      mockTranslationsService.locales.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.getLocales()).rejects.toThrow('Database error');
      expect(mockTranslationsService.locales).toHaveBeenCalled();
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

  describe('deleteContents', () => {
    it('should successfully delete contents', async () => {
      const keys = ['key1', 'key2', 'key3'];
      const mockContents = [
        { id: 1, key: 'key1', value: 'value1', translationId: 1 },
        { id: 2, key: 'key2', value: 'value2', translationId: 1 },
        { id: 3, key: 'key3', value: 'value3', translationId: 1 },
      ];
      const mockDeleteResult = { count: 3 };

      mockTranslationsService.getTranslationContents.mockResolvedValue(
        mockContents,
      );
      mockTranslationsService.deleteTranslations.mockResolvedValue(
        mockDeleteResult,
      );

      const result = await controller.deleteContents(keys);

      expect(
        mockTranslationsService.getTranslationContents,
      ).toHaveBeenCalledWith(keys);
      expect(mockTranslationsService.deleteTranslations).toHaveBeenCalledWith(
        keys,
      );
      expect(result).toEqual(mockContents);
    });

    it('should handle empty array of keys', async () => {
      const keys: string[] = [];

      await expect(controller.deleteContents(keys)).rejects.toThrow(
        'Keys array is empty',
      );
      expect(
        mockTranslationsService.getTranslationContents,
      ).not.toHaveBeenCalled();
      expect(mockTranslationsService.deleteTranslations).not.toHaveBeenCalled();
    });
    it('should throw when no contents found', async () => {
      const keys = ['nonexistent.key1', 'nonexistent.key2'];
      const mockDeleteResult = { count: 0 };

      mockTranslationsService.getTranslationContents.mockResolvedValue(null);
      mockTranslationsService.deleteTranslations.mockResolvedValue(
        mockDeleteResult,
      );

      await expect(controller.deleteContents(keys)).rejects.toThrow(
        BadRequestException,
      );

      expect(
        mockTranslationsService.getTranslationContents,
      ).toHaveBeenCalledWith(keys);
      expect(mockTranslationsService.deleteTranslations).not.toHaveBeenCalled();
    });
  });

  describe('updateContents', () => {
    it('should update multiple contents successfully', async () => {
      const mockContentDtos: UpdateContentDto[] = [
        {
          id: 1,
          key: 'greeting.hello',
          value: 'Bonjour',
          locale: 'fr-FR',
        },
        {
          id: 2,
          key: 'greeting.goodbye',
          value: 'Au revoir',
          locale: 'fr-FR',
        },
      ];

      const mockUpdatedContents = [
        {
          id: 1,
          key: 'greeting.hello',
          value: 'Bonjour',
          translationId: 1,
        },
        {
          id: 2,
          key: 'greeting.goodbye',
          value: 'Au revoir',
          translationId: 1,
        },
      ];

      mockTranslationsService.updateTranslationContent
        .mockResolvedValueOnce(mockUpdatedContents[0])
        .mockResolvedValueOnce(mockUpdatedContents[1]);

      const result = await controller.updateContents(mockContentDtos);

      expect(result).toEqual(mockUpdatedContents);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenNthCalledWith(1, mockContentDtos[0]);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenNthCalledWith(2, mockContentDtos[1]);
    });

    it('should update single content successfully', async () => {
      const mockContentDto: UpdateContentDto = {
        id: 1,
        key: 'greeting.hello',
        value: 'Hello World',
        locale: 'en-US',
      };

      const mockUpdatedContent = {
        id: 1,
        key: 'greeting.hello',
        value: 'Hello World',
        translationId: 2,
      };

      mockTranslationsService.updateTranslationContent.mockResolvedValue(
        mockUpdatedContent,
      );

      const result = await controller.updateContents([mockContentDto]);

      expect(result).toEqual([mockUpdatedContent]);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledWith(mockContentDto);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when no contents provided', async () => {
      const emptyContentDtos: UpdateContentDto[] = [];

      await expect(controller.updateContents(emptyContentDtos)).rejects.toThrow(
        new BadRequestException('No contents provided.'),
      );

      expect(
        mockTranslationsService.updateTranslationContent,
      ).not.toHaveBeenCalled();
    });

    it('should handle service errors during update', async () => {
      const mockContentDto: UpdateContentDto = {
        id: 999,
        key: 'nonexistent.key',
        value: 'Some value',
        locale: 'en-US',
      };

      mockTranslationsService.updateTranslationContent.mockRejectedValue(
        new BadRequestException('Translation not found'),
      );

      await expect(controller.updateContents([mockContentDto])).rejects.toThrow(
        new BadRequestException('Translation not found'),
      );

      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledWith(mockContentDto);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle partial failures in batch update', async () => {
      const mockContentDtos: UpdateContentDto[] = [
        {
          id: 1,
          key: 'greeting.hello',
          value: 'Bonjour',
          locale: 'fr-FR',
        },
        {
          id: 2,
          key: 'invalid.key',
          value: 'Invalid',
          locale: 'nonexistent',
        },
      ];

      const mockUpdatedContent = {
        id: 1,
        key: 'greeting.hello',
        value: 'Bonjour',
        translationId: 1,
      };

      mockTranslationsService.updateTranslationContent
        .mockResolvedValueOnce(mockUpdatedContent)
        .mockRejectedValueOnce(
          new BadRequestException('Translation not found'),
        );

      await expect(controller.updateContents(mockContentDtos)).rejects.toThrow(
        new BadRequestException('Translation not found'),
      );

      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenNthCalledWith(1, mockContentDtos[0]);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenNthCalledWith(2, mockContentDtos[1]);
    });

    it('should handle empty values in update', async () => {
      const mockContentDto: UpdateContentDto = {
        id: 1,
        key: 'greeting.empty',
        value: '',
        locale: 'fr-FR',
      };

      const mockUpdatedContent = {
        id: 1,
        key: 'greeting.empty',
        value: '',
        translationId: 1,
      };

      mockTranslationsService.updateTranslationContent.mockResolvedValue(
        mockUpdatedContent,
      );

      const result = await controller.updateContents([mockContentDto]);

      expect(result).toEqual([mockUpdatedContent]);
      expect(
        mockTranslationsService.updateTranslationContent,
      ).toHaveBeenCalledWith(mockContentDto);
    });
  });
});
