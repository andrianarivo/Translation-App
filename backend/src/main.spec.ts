import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('bootstrap', () => {
  let app: INestApplication;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should create NestApplication', async () => {
    app = await NestFactory.create(AppModule);
    expect(app).toBeDefined();
  });
});
