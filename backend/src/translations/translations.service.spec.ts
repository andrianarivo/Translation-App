import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsService } from './translations.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  Translation,
  TranslationFile,
  Content,
} from '../../generated/prisma';
import { BadRequestException } from '@nestjs/common';

describe('TranslationsService', () => {
  let service: TranslationsService;

  const mockPrismaService = {
    translationFile: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    translation: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    content: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    $queryRawUnsafe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TranslationsService>(TranslationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTranslationFile', () => {
    it('should create a translation file', async () => {
      const mockData: Prisma.TranslationFileCreateInput = {
        filename: 'test.json',
        content: '{}',
      };

      const mockResult: TranslationFile = {
        id: 1,
        filename: 'test.json',
        content: '{}',
        parsed: false,
      };

      mockPrismaService.translationFile.create.mockResolvedValue(mockResult);

      const result = await service.createTranslationFile(mockData);

      expect(mockPrismaService.translationFile.create).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('translations', () => {
    it('should return correct translations for multiple languages', async () => {
      const languages = ['en', 'fr'];
      const mockResult = [
        { key: 'greeting', en: 'Hello', fr: 'Bonjour' },
        { key: 'farewell', en: 'Goodbye', fr: 'Au revoir' },
      ];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await service.translations(languages);

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should return correct translations for single language', async () => {
      const languages = ['en'];
      const mockResult = [
        { key: 'greeting', en: 'Hello' },
        { key: 'farewell', en: 'Goodbye' },
      ];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockResult);

      const result = await service.translations(languages);

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('translationFiles', () => {
    it('should fetch translation files by ids', async () => {
      const mockIds = [1, 2];
      const mockFiles: TranslationFile[] = [
        { id: 1, filename: 'test1.json', content: '{}', parsed: false },
        { id: 2, filename: 'test2.json', content: '{}', parsed: false },
      ];

      mockPrismaService.translationFile.findMany.mockResolvedValue(mockFiles);

      const result = await service.translationFiles(mockIds);

      expect(mockPrismaService.translationFile.findMany).toHaveBeenCalledWith({
        where: { id: { in: mockIds } },
      });
      expect(result).toEqual(mockFiles);
    });
  });

  describe('parseTranslationFile', () => {
    it('should parse file and create translation if not exists', async () => {
      const mockFile: TranslationFile = {
        id: 1,
        filename: 'test.json',
        content: '{"key1": "value1", "nested": {"key2": "value2"}}',
        parsed: false,
      };

      const mockTranslation: Translation = {
        id: 1,
        name: 'test',
        version: 0,
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(null);
      mockPrismaService.translation.create.mockResolvedValue(mockTranslation);
      mockPrismaService.content.createMany.mockResolvedValue({ count: 2 });

      const result = await service.parseTranslationFile(mockFile);

      expect(mockPrismaService.translation.findFirst).toHaveBeenCalledWith({
        where: { name: 'test' },
      });
      expect(mockPrismaService.translation.create).toHaveBeenCalledWith({
        data: { name: 'test', version: 0 },
      });
      expect(mockPrismaService.content.createMany).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.arrayContaining([
          { key: 'key1', value: 'value1', translationId: 1 },
          { key: 'nested.key2', value: 'value2', translationId: 1 },
        ]),
      });
      expect(result).toEqual(mockTranslation);
    });

    it('should use existing translation if found', async () => {
      const mockFile: TranslationFile = {
        id: 1,
        filename: 'test.json',
        content: '{"key1": "value1"}',
        parsed: false,
      };

      const mockTranslation: Translation = {
        id: 1,
        name: 'test',
        version: 0,
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(
        mockTranslation,
      );
      mockPrismaService.content.createMany.mockResolvedValue({ count: 1 });

      const result = await service.parseTranslationFile(mockFile);

      expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      expect(mockPrismaService.content.createMany).toHaveBeenCalled();
      expect(result).toEqual(mockTranslation);
    });
  });

  describe('toggleTranslationFileParsed', () => {
    it('should toggle parsed status of translation file', async () => {
      const mockFile: TranslationFile = {
        id: 1,
        filename: 'test.json',
        content: '{}',
        parsed: false,
      };

      const updatedMockFile = { ...mockFile, parsed: true };

      mockPrismaService.translationFile.findUnique.mockResolvedValue(mockFile);
      mockPrismaService.translationFile.update.mockResolvedValue(
        updatedMockFile,
      );

      const result = await service.toggleTranslationFileParsed(1);

      expect(mockPrismaService.translationFile.findUnique).toHaveBeenCalledWith(
        {
          where: { id: 1 },
        },
      );
      expect(mockPrismaService.translationFile.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { parsed: true },
      });
      expect(result).toEqual(updatedMockFile);
    });

    it('should throw error if translation file not found', async () => {
      mockPrismaService.translationFile.findUnique.mockResolvedValue(null);

      await expect(service.toggleTranslationFileParsed(1)).rejects.toThrow(
        'Translation file not found',
      );
    });
  });

  describe('locales', () => {
    it('should return list of translation names', async () => {
      const mockTranslations = [{ name: 'en' }, { name: 'fr' }, { name: 'es' }];

      mockPrismaService.translation.findMany.mockResolvedValue(
        mockTranslations,
      );

      const result = await service.locales();

      expect(mockPrismaService.translation.findMany).toHaveBeenCalledWith({
        select: {
          name: true,
        },
      });
      expect(result).toEqual(['en', 'fr', 'es']);
    });

    it('should return empty array when no translations exist', async () => {
      mockPrismaService.translation.findMany.mockResolvedValue([]);

      const result = await service.locales();

      expect(mockPrismaService.translation.findMany).toHaveBeenCalledWith({
        select: {
          name: true,
        },
      });
      expect(result).toEqual([]);
    });
  });

  describe('deleteTranslations', () => {
    it('should delete multiple contents by keys', async () => {
      const mockKeys = ['greeting', 'farewell'];
      const mockBatchPayload = { count: 2 };

      mockPrismaService.content.deleteMany.mockResolvedValue(mockBatchPayload);

      const result = await service.deleteTranslations(mockKeys);

      expect(mockPrismaService.content.deleteMany).toHaveBeenCalledWith({
        where: {
          key: {
            in: mockKeys,
          },
        },
      });
      expect(result).toEqual(mockBatchPayload);
    });

    it('should return batch payload with count 0 when no contents are deleted', async () => {
      const mockKeys = ['nonexistent.key1', 'nonexistent.key2'];
      const mockBatchPayload = { count: 0 };

      mockPrismaService.content.deleteMany.mockResolvedValue(mockBatchPayload);

      const result = await service.deleteTranslations(mockKeys);

      expect(mockPrismaService.content.deleteMany).toHaveBeenCalledWith({
        where: {
          key: {
            in: mockKeys,
          },
        },
      });
      expect(result).toEqual(mockBatchPayload);
    });
  });

  describe('getTranslationContents', () => {
    it('should return contents for given keys', async () => {
      const mockKeys = ['greeting', 'farewell'];
      const mockContents = [
        { id: 1, key: 'greeting', value: 'Hello', translationId: 1 },
        { id: 2, key: 'farewell', value: 'Goodbye', translationId: 1 },
      ];

      mockPrismaService.content.findMany.mockResolvedValue(mockContents);

      const result = await service.getTranslationContents(mockKeys);

      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {
          key: {
            in: mockKeys,
          },
        },
      });
      expect(result).toEqual(mockContents);
    });

    it('should return empty array when no contents found', async () => {
      const mockKeys = ['nonexistent.key1', 'nonexistent.key2'];

      mockPrismaService.content.findMany.mockResolvedValue([]);

      const result = await service.getTranslationContents(mockKeys);

      expect(mockPrismaService.content.findMany).toHaveBeenCalledWith({
        where: {
          key: {
            in: mockKeys,
          },
        },
      });
      expect(result).toEqual([]);
    });
  });

  describe('updateTranslationContent', () => {
    it('should upsert content with provided data and locale', async () => {
      const mockInput = {
        id: 1,
        key: 'greeting.hello',
        value: 'Bonjour',
        locale: 'fr',
      };

      const mockTranslation = {
        id: 1,
        name: 'fr',
        version: 0,
      };

      const mockUpsertedContent: Content = {
        id: 1,
        key: 'greeting.hello',
        value: 'Bonjour',
        translationId: 1,
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(
        mockTranslation,
      );
      mockPrismaService.content.upsert.mockResolvedValue(mockUpsertedContent);

      const result = await service.updateTranslationContent(mockInput);

      expect(mockPrismaService.translation.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'fr',
        },
      });
      expect(mockPrismaService.content.upsert).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        create: {
          key: 'greeting.hello',
          value: 'Bonjour',
          translationId: 1,
        },
        update: {
          key: 'greeting.hello',
          value: 'Bonjour',
        },
      });
      expect(result).toEqual(mockUpsertedContent);
    });

    it('should throw BadRequestException when translation not found', async () => {
      const mockInput = {
        id: 1,
        key: 'greeting.hello',
        value: 'Hello',
        locale: 'nonexistent',
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(null);

      await expect(service.updateTranslationContent(mockInput)).rejects.toThrow(
        Error,
      );
      await expect(service.updateTranslationContent(mockInput)).rejects.toThrow(
        'Locale not found',
      );

      expect(mockPrismaService.translation.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'nonexistent',
        },
      });
      expect(mockPrismaService.content.upsert).not.toHaveBeenCalled();
    });

    it('should create new content when upserting with non-existing id', async () => {
      const mockInput = {
        id: 999,
        key: 'new.key',
        value: 'New Value',
        locale: 'en',
      };

      const mockTranslation = {
        id: 2,
        name: 'en',
        version: 0,
      };

      const mockCreatedContent: Content = {
        id: 999,
        key: 'new.key',
        value: 'New Value',
        translationId: 2,
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(
        mockTranslation,
      );
      mockPrismaService.content.upsert.mockResolvedValue(mockCreatedContent);

      const result = await service.updateTranslationContent(mockInput);

      expect(mockPrismaService.content.upsert).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
        create: {
          key: 'new.key',
          value: 'New Value',
          translationId: 2,
        },
        update: {
          key: 'new.key',
          value: 'New Value',
        },
      });
      expect(result).toEqual(mockCreatedContent);
    });

    it('should handle empty values', async () => {
      const mockInput = {
        id: 1,
        key: 'greeting.empty',
        value: '',
        locale: 'en',
      };

      const mockTranslation = {
        id: 1,
        name: 'en',
        version: 0,
      };

      const mockUpsertedContent: Content = {
        id: 1,
        key: 'greeting.empty',
        value: '',
        translationId: 1,
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(
        mockTranslation,
      );
      mockPrismaService.content.upsert.mockResolvedValue(mockUpsertedContent);

      const result = await service.updateTranslationContent(mockInput);

      expect(mockPrismaService.content.upsert).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        create: {
          key: 'greeting.empty',
          value: '',
          translationId: 1,
        },
        update: {
          key: 'greeting.empty',
          value: '',
        },
      });
      expect(result).toEqual(mockUpsertedContent);
    });

    it('should handle special characters in key and value', async () => {
      const mockInput = {
        id: 4,
        key: 'special.characters-test_key',
        value: 'Valeur avec caractères spéciaux: éàù & <>!',
        locale: 'fr',
      };

      const mockTranslation = {
        id: 1,
        name: 'fr',
        version: 0,
      };

      const mockUpsertedContent: Content = {
        id: 4,
        key: 'special.characters-test_key',
        value: 'Valeur avec caractères spéciaux: éàù & <>!',
        translationId: 1,
      };

      mockPrismaService.translation.findFirst.mockResolvedValue(
        mockTranslation,
      );
      mockPrismaService.content.upsert.mockResolvedValue(mockUpsertedContent);

      const result = await service.updateTranslationContent(mockInput);

      expect(mockPrismaService.translation.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'fr',
        },
      });
      expect(mockPrismaService.content.upsert).toHaveBeenCalledWith({
        where: {
          id: 4,
        },
        create: {
          key: 'special.characters-test_key',
          value: 'Valeur avec caractères spéciaux: éàù & <>!',
          translationId: 1,
        },
        update: {
          key: 'special.characters-test_key',
          value: 'Valeur avec caractères spéciaux: éàù & <>!',
        },
      });
      expect(result).toEqual(mockUpsertedContent);
    });
  });
});
