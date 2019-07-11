

const assert = require('assert'); // use assert to check if options are set
const Cookie = require('cookie'); // highly popular decoupled cookie parser

const logger = require('winston');
const jwt = require('jsonwebtoken'); // https://github.com/docdis/learn-json-web-tokens
const fs = require('fs');
const mkdirp = require('mkdirp');
const jose = require('node-jose');

let privateCert = null;
let publicCert = null;
let jwkKey = null;
// var jwkPublicKey = null;

if (privateCert == null || publicCert == null) {
	if (fs.existsSync('./certs/private.pem') && fs.existsSync('./certs/public.pem')) {
		logger.info('Certificate Files Exists.');
		privateCert = fs.readFileSync('./certs/private.pem');
		publicCert = fs.readFileSync('./certs/public.pem');
	} else {
		logger.info('Certificate Files Not Exists, Creating new Certificates.');
		jose.JWK.createKey('RSA', 1024, { alg: 'RSA-OAEP' })
			.then((result) => {
				privateCert = result.toPEM(true);
				publicCert = result.toPEM();
				mkdirp.sync('./certs/', {});
				fs.writeFileSync('./certs/private.pem', privateCert);
				fs.writeFileSync('./certs/public.pem', publicCert);
				process.exit(0);
			}).catch((err) => {
				logger.error('Certificate Files Read Error : ', err);
				process.exit(0);
			});
	}
}
exports.publicCert = publicCert;

const getKeys = () => new Promise((resolve, reject) => {
	jose.JWK.asKey(privateCert, 'pem')
		.then((result) => {
			const { keystore } = result;
			jwkKey = keystore.get(0);
			resolve(true);
		}).catch((err) => {
			reject(err);
		});
});

// const getPublicKey = () => new Promise((resolve, reject) => {
//     jose.JWK.asKey(publicCert, "pem")
//         .then((result) => {
//             var keystore = result.keystore;
//             jwkPublicKey = keystore.get(0);
//             resolve(true);
//         }).catch((err) => {
//             reject(err);
//         });
// });

const decryptToken = token => new Promise((resolve, reject) => {
	jose.JWE.createDecrypt(jwkKey)
		.decrypt(token)
		.then((decrypt) => {
			resolve(decrypt.payload.toString());
		}).catch((err) => {
			reject(err);
		});
});

// eslint-disable-next-line no-unused-vars
const verifyJWT = token => new Promise((resolve, reject) => {
	jwt.verify(token, publicCert, (err, decoded) => {
		if (err) {
			reject(err);
		} else {
			resolve(decoded);
		}
	});
});

const signJWT = (data, type, expTime) => new Promise((resolve) => {
	const token = jwt.sign(data,
		privateCert,
		{
			expiresIn: expTime,
			subject: type,
			algorithm: 'RS256'
		});
	resolve(token);
});

const encryptToken = token => new Promise((resolve, reject) => {
	jose.JWE.createEncrypt({ format: 'compact', zip: true }, jwkKey)
		.update(token, 'utf8')
		.final()
		.then((encrypted) => {
			resolve(encrypted);
		})
		.catch((err) => {
			reject(err);
		});
});

const generateJWT = (data, type, expTime) => new Promise((resolve, reject) => {
	signJWT(data, type, expTime)
		.then(encryptToken)
		.then((token) => {
			resolve(token);
		}).catch((err) => {
			reject(err);
		});
});
exports.generateJWT = generateJWT;

/**
 * isFunction checks if a given value is a function.
 * @param {Object} functionToCheck - the object we want to confirm is a function
 * @returns {Boolean} - true if the functionToCheck is a function. :-)
 */
const isFunction = (functionToCheck) => {
	const getType = {};

	return functionToCheck
		&& getType.toString.call(functionToCheck) === '[object Function]';
};

/**
 * isArray checks if a given variable is an Array.
 * @param {Object} variable - the value we want to confirm is an Array
 * @returns {Boolean} - true if the variable is an Array.
 */
const isArray = (variable) => {
	const getType = {};

	return variable
		&& getType.toString.call(variable) === '[object Array]';
};

/**
 * customOrDefaultKey is a re-useable method to determing if the developer
 * using the plugin has defined a custom key for extractin the JWT
 * @param {Object} options - the options passed in when registering the plugin
 * @param {String} key - name of the key e.g `urlKey` see: https://git.io/vXbJN
 * @param {String} _default - the default key used if no custom is defined.
 * @returns {String} key - the custom key or default key.
 */
const customOrDefaultKey = (options, key, _default) => (options[key] === false
	|| typeof options[key] === 'string' ? options[key] : _default);

/**
* Extract the JWT from URL, Auth Header or Cookie
* @param {Object} request - standard hapi request object inclduing headers
* @param {Object} options - the configuration options defined by the person
* using the plugin. this includes relevant keys. (see docs in Readme)
* @returns {String} token - the raw JSON Webtoken or `null` if invalid
*/
const extract = (request, options) => {
	// The key holding token value in url or cookie defaults to token
	let auth; let
		token;
	const cookieKey = customOrDefaultKey(options, 'cookieKey', 'token');
	const headerKey = customOrDefaultKey(options, 'headerKey', 'authorization');
	const urlKey = customOrDefaultKey(options, 'urlKey', 'token');
	const pattern = new RegExp(`${options.tokenType}\\s+([^$]+)`, 'i');

	if (urlKey && request.query[urlKey]) { // tokens via url: https://github.com/dwyl/hapi-auth-jwt2/issues/19
		auth = request.query[urlKey];
	} else if (headerKey && request.headers[headerKey]) {
		if (typeof options.tokenType === 'string') {
			token = request.headers[headerKey].match(pattern);
			auth = token === null ? null : token[1];
		} else {
			auth = request.headers[headerKey];
		} // JWT tokens in cookie: https://github.com/dwyl/hapi-auth-jwt2/issues/55
	} else if (cookieKey && request.headers.cookie) {
		auth = Cookie.parse(request.headers.cookie)[cookieKey];
	}

	// strip pointless "Bearer " label & any whitespace > http://git.io/xP4F
	return auth ? auth.replace(/Bearer/gi, '').replace(/ /g, '') : null;
};

/**
* isValid is a basic check for JWT validity of Token format http://git.io/xPBn
* @param {String} token - the token extracted from Header/Cookie/query
* @returns {Boolean} true|false - true if JWT is valid. false if invalid.
*/
const isValid = token => token.split('.').length === 3;

const implementation = (server, options) => {
	assert(options, 'options are required for jwt auth scheme'); // pre-auth checks
	assert(options.validateFunc
		|| options.verifyFunc, 'validateFunc OR verifyFunc function is required!');
	return {
		/**
         * authenticate is the "work horse" of the plugin. it's the method that gets
         * called every time a route is requested and needs to validate/verify a JWT
         * @param {Object} request - the standard route handler request object
         * @param {Object} reply - the standard hapi reply interface
         * @returns {Boolean} if the JWT is valid we return a credentials object
         * otherwise throw an error to inform the app & client of unauthorized req.
         */
		authenticate(request, reply) {
			let token = extract(request, options); // extract token Header/Cookie/Query
			let decoded; let
				keyFunc;

			if (!token) {
				logger.error('token not found : ', token);
				return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
			}

			decryptToken(token)
				.then((decryptedToken) => {
					token = decryptedToken;

					if (!isValid(token)) { // quick check for validity of token format
						logger.error('Invalid Token : ', token);
						return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
					} // verification is done later, but we want to avoid decoding if malformed

					request.auth.token = token; // keep encoded JWT available in the request
					// otherwise use the same key (String) to validate all JWTs

					try {
						decoded = jwt.decode(token, { complete: options.complete || false });
					} catch (e) { // request should still FAIL if the token does not decode.
						logger.error('Error decode jwt : ', e);
						return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
					}

					if (options.key && typeof options.validateFunc === 'function') {
						// if keyFunc is function allow dynamic key lookup: https://git.io/vXjvY
						keyFunc = (isFunction(options.key))
							? options.key : (decoded, callback) => callback(null, options.key);

						keyFunc(decoded, (err, key, extraInfo) => {
							const verifyOptions = options.verifyOptions || {};
							const keys = (isArray(key)) ? key : [key];
							let keysTried = 0;

							if (err) {
								logger.error('Error verify jwt : ', err);
								return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
							}
							if (extraInfo) {
								request.plugins['hapi-jwt-jwe'] = { extraInfo };
							}

							keys.some((k) => { // itterate through one or more JWT keys
								jwt.verify(token, k, verifyOptions,
									(verifyErr, verifyDecoded) => {
										if (verifyErr) {
											logger.error('Error While verify jwt : ', verifyErr);
											keysTried += 1;
											if (keysTried >= keys.length) {
												return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
											}
											// There are still other keys that might work

											// return false;
										} else { // see: http://hapijs.com/tutorials/auth for validateFunc signature
											return options.validateFunc(verifyDecoded, request,
												(validateErr, valid, credentials) => { // bring your own checks
													if (validateErr) {
														logger.error('Error While validate jwt : ', validateErr);
														return reply({ message: validateErr.message }).code(validateErr.code);
													}
													if (!valid) {
														return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
													}
													reply.continue({
														credentials: credentials || verifyDecoded,
														artifacts: token
													});


													return false;
												});
										}

										return false;
									});

								return false;
							});

							return true;
						}); // END keyFunc
					} else { // see: https://github.com/dwyl/hapi-auth-jwt2/issues/130
						return options.verifyFunc(decoded, request,
							(verifyError, valid, credentials) => {
								if (verifyError) {
									logger.error('Error While verify jwt : ', verifyError);
									return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
								}
								if (!valid) {
									return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
								}
								reply.continue({
									credentials: credentials || decoded,
									artifacts: token
								});


								return true;
							});
					}

					return true;
				}).catch((err) => {
					logger.error('Error While Decrypting key : ', err);
					return reply({ message: request.i18n.__('genericErrMsg')['401'] }).code(401);
				});
		}
	};
};

/**
 * register registers the name and exposes the implementation of the plugin
 * see: http://hapijs.com/api#serverplugins for plugin format
 * @param {Object} server - the hapi server to which we are attaching the plugin
 * @param {Object} options - any options set during plugin registration
 * in this case we are not using the options during register but we do later.
 * @param {Function} next - the callback called once registration succeeds
 * @returns {Function} next - returns (calls) the callback when complete.
 */
exports.register = (server, options, next) => {
	if (privateCert != null) {
		getKeys()
			// .then(getPublicKey)
			.then(() => {
			}).catch((err) => {
				logger.error('Error while Reading Key : ', err);
			});
	}
	server.auth.scheme('jwt', implementation); // hapijs.com/api#serverauthapi

	return next();
};

/**
 * attributes merely aliases the package.json (re-uses package name & version)
 * simple example: github.com/hapijs/hapi/blob/master/API.md#serverplugins
 */
exports.register.attributes = { // hapi requires attributes for a plugin.
	name: 'hapi-jwt-jwe',
	version: '1.0.0' // also see: http://hapijs.com/tutorials/plugins
};
