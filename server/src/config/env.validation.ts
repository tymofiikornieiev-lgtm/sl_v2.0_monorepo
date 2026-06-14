import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  APP_PORT: Joi.number().port().default(3003),
  API_PREFIX: Joi.string().required(),

  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_SYNCHRONIZE: Joi.string().required(),
  DB_LOGGING: Joi.string().required(),
  DB_AUTO_LOAD_ENTITIES: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),

  CORS_ORIGIN: Joi.string().required(),
  COOKIE_NAME: Joi.string().required(),
  COOKIE_HTTP_ONLY: Joi.string().required(),
  COOKIE_SAME_SITE: Joi.string().required(),
  COOKIE_SECURE: Joi.string().required(),
});
