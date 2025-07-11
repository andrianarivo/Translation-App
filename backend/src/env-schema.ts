import * as Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  OPENAI_API_KEY: Joi.string().required(),
});

export default envSchema;
