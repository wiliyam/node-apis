

const joi = require('joi');

const envVarsSchema = joi.object({
	AUTH_MONGO_URL: joi.string()
		.required()
}).unknown()
	.required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const config = {
	mongodb: {
		url: envVars.AUTH_MONGO_URL
	}
};

module.exports = config;
