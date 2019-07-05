

const joi = require('joi');

const envVarsSchema = joi.object({
	AUTH_PORT: joi.number()
		.required(),
	AUTH_ACCESS_EXPIRY_TIME: joi.number()
		.required(),
	AUTH_REFRESH_EXPIRY_TIME: joi.number()
		.required()
}).unknown()
	.required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const config = {
	server: {
		port: envVars.AUTH_PORT
	},
	auth: {
		accessExpiry: envVars.AUTH_ACCESS_EXPIRY_TIME,
		refreshExpiry: envVars.AUTH_REFRESH_EXPIRY_TIME
	}
};

module.exports = config;
