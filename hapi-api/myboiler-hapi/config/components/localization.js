const joi = require("joi");

const envVarsSchema = joi
  .object({
    AUTH_DEFAULT_LANGUAGE: joi.string().default("en"),
    AUTH_LANGUAGES: joi.string().default("en")
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  localization: {
    DEFAULT_LANGUAGE: envVars.AUTH_DEFAULT_LANGUAGE,
    LANGUAGES: envVars.AUTH_LANGUAGES
  }
};

module.exports = config;
