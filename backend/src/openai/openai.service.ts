import OpenAI from 'openai';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { TRANSLATION_PROMPT } from '../utils/prompts';

const createTranslationSchema = Joi.object({
  id: Joi.number().required(),
  key: Joi.string().required(),
  locale: Joi.string().required(),
  value: Joi.string().required(),
});

const translationsResponseSchema = Joi.array().items(createTranslationSchema);

export interface CreateTranslation {
  id: number;
  key: string;
  locale: string;
  value: string;
}

@Injectable()
export class OpenaiService {
  client = new OpenAI();

  async getMissingTranslations(
    translations: string,
  ): Promise<CreateTranslation[]> {
    const response = await this.client.responses.create({
      model: 'gpt-4.1',
      input: TRANSLATION_PROMPT.concat(translations),
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedResponse = JSON.parse(response.output_text);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error, value } =
        translationsResponseSchema.validate(parsedResponse);

      if (error) {
        throw new BadRequestException(
          `Invalid response format from OpenAI: ${error.message}`,
        );
      }

      return value as CreateTranslation[];
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON response from OpenAI: ${error.message}`);
      }
      throw error;
    }
  }
}
