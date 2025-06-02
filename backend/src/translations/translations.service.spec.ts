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
});
