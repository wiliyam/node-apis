

const joi = require('joi');

const envVarsSchema = joi.object({
	AUTH_MONGO_URL: joi.string().required()
}).unknown().required();

const envVars = joi.attempt(process.env, envVarsSchema);

module.exports = envVars.AUTH_MONGO_URL;
