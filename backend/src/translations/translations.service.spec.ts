import { Test, TestingModule } from '@nestjs/testing';
import { TranslationsService } from './translations.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TranslationFile } from '../../generated/prisma';

describe('TranslationsService', () => {
  let service: TranslationsService;

  const mockPrismaService = {
    translationFile: {
      create: jest.fn(),
    },
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
      };

      mockPrismaService.translationFile.create.mockResolvedValue(mockResult);

      const result = await service.createTranslationFile(mockData);

      expect(mockPrismaService.translationFile.create).toHaveBeenCalledWith({
        data: mockData,
      });
      expect(result).toEqual(mockResult);
    });
  });
});
