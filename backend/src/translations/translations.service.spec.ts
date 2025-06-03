import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsService } from './translations.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Translation, TranslationFile } from '../../generated/prisma';

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
      create: jest.fn(),
    },
    content: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
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
    it('should update content with provided key and value', async () => {
      const mockContent = {
        id: 1,
        key: 'greeting.hello',
        value: 'Bonjour',
      };
      const mockUpdatedContent = {
        id: 1,
        key: 'greeting.hello',
        value: 'Bonjour',
        translationId: 1,
      };

      mockPrismaService.content.update.mockResolvedValue(mockUpdatedContent);

      const result = await service.updateTranslationContent(mockContent);

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          key: mockContent.key,
          value: mockContent.value,
        },
      });
      expect(result).toEqual(mockUpdatedContent);
    });

    it('should update content with empty value', async () => {
      const mockContent = {
        id: 2,
        key: 'greeting.goodbye',
        value: '',
      };
      const mockUpdatedContent = {
        id: 2,
        key: 'greeting.goodbye',
        value: '',
        translationId: 1,
      };

      mockPrismaService.content.update.mockResolvedValue(mockUpdatedContent);

      const result = await service.updateTranslationContent(mockContent);

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          key: mockContent.key,
          value: mockContent.value,
        },
      });
      expect(result).toEqual(mockUpdatedContent);
    });

    it('should update content with nested key', async () => {
      const mockContent = {
        id: 3,
        key: 'navigation.menu.items.home',
        value: 'Accueil',
      };
      const mockUpdatedContent = {
        id: 3,
        key: 'navigation.menu.items.home',
        value: 'Accueil',
        translationId: 2,
      };

      mockPrismaService.content.update.mockResolvedValue(mockUpdatedContent);

      const result = await service.updateTranslationContent(mockContent);

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          key: mockContent.key,
          value: mockContent.value,
        },
      });
      expect(result).toEqual(mockUpdatedContent);
    });

    it('should handle special characters in key and value', async () => {
      const mockContent = {
        id: 4,
        key: 'special.characters-test_key',
        value: 'Valeur avec caractères spéciaux: éàù & <>!',
      };
      const mockUpdatedContent = {
        id: 4,
        key: 'special.characters-test_key',
        value: 'Valeur avec caractères spéciaux: éàù & <>!',
        translationId: 1,
      };

      mockPrismaService.content.update.mockResolvedValue(mockUpdatedContent);

      const result = await service.updateTranslationContent(mockContent);

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          key: mockContent.key,
          value: mockContent.value,
        },
      });
      expect(result).toEqual(mockUpdatedContent);
    });

    it('should update content with partial data (only key)', async () => {
      const mockContent = {
        id: 5,
        key: 'new.key',
      };
      const mockUpdatedContent = {
        id: 5,
        key: 'new.key',
        value: 'existing value',
        translationId: 1,
      };

      mockPrismaService.content.update.mockResolvedValue(mockUpdatedContent);

      const result = await service.updateTranslationContent(mockContent);

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          key: mockContent.key,
        },
      });
      expect(result).toEqual(mockUpdatedContent);
    });

    it('should update content with partial data (only value)', async () => {
      const mockContent = {
        id: 6,
        value: 'new value',
      };
      const mockUpdatedContent = {
        id: 6,
        key: 'existing.key',
        value: 'new value',
        translationId: 1,
      };

      mockPrismaService.content.update.mockResolvedValue(mockUpdatedContent);

      const result = await service.updateTranslationContent(mockContent);

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          value: mockContent.value,
        },
      });
      expect(result).toEqual(mockUpdatedContent);
    });

    it('should propagate Prisma errors when update fails', async () => {
      const mockContent = {
        id: 999,
        key: 'test.key',
        value: 'test value',
      };
      const prismaError = new Error('Record not found');

      mockPrismaService.content.update.mockRejectedValue(prismaError);

      await expect(
        service.updateTranslationContent(mockContent),
      ).rejects.toThrow('Record not found');

      expect(mockPrismaService.content.update).toHaveBeenCalledWith({
        where: {
          id: mockContent.id,
        },
        data: {
          key: mockContent.key,
          value: mockContent.value,
        },
      });
    });
  });
});
