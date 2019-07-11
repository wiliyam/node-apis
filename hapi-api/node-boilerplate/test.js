/* eslint-disable no-console */
// required packages
// "hapi-auth-jwt2": "^8.6.1",
//     "node-jose": "^1.1.3"
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jose = require('node-jose');

let privateCert = null;
let publicCert = null;
let jwkKey = null;

const checkCertificate = () => new Promise((resolve, reject) => {
	if (privateCert == null || publicCert == null) {
		if (fs.existsSync('./certs/private.pem') || fs.existsSync('./certs/public.pem')) {
			console.log('exists');
			privateCert = fs.readFileSync('./certs/private.pem');
			publicCert = fs.readFileSync('./certs/public.pem');
			resolve(true);
		} else {
			console.log('not exists');
			jose.JWK.createKey('RSA', 1024, { alg: 'RSA-OAEP' })
				.then((result) => {
					privateCert = result.toPEM(true);
					publicCert = result.toPEM();
					fs.writeFileSync('./certs/private.pem', privateCert);
					fs.writeFileSync('./certs/public.pem', publicCert);
					resolve(true);
				}).catch((err) => {
					reject(err);
				});
		}
	} else {
		resolve(true);
	}
});

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

// eslint-disable-next-line no-unused-vars
const signJWT = () => new Promise((resolve, _reject) => {
	const data = { foo: 'bar' };
	const token = jwt.sign(data,
		privateCert,
		{
			expiresIn: 9200,
			subject: 'web',
			algorithm: 'RS256'
		});
	console.log('-------------------------------------------------------------------------');
	console.log('JWT Token : ', token);
	console.log('-------------------------------------------------------------------------');
	resolve(token);
});

const encryptToken = token => new Promise((resolve, reject) => {
	jose.JWE.createEncrypt({ format: 'compact', zip: true }, jwkKey)
		.update(token, 'utf8')
		.final()
		.then((encrypted) => {
			console.log('-------------------------------------------------------------------------');
			console.log('Encrypted Token : ', encrypted);
			console.log('-------------------------------------------------------------------------');
			resolve(encrypted);
		})
		.catch((err) => {
			reject(err);
		});
});

const decryptToken = token => new Promise((resolve, reject) => {
	jose.JWE.createDecrypt(jwkKey)
		.decrypt(token)
		.then((decrypt) => {
			resolve(decrypt.payload.toString());
		}).catch((err) => {
			reject(err);
		});
});

const verifyJWT = token => new Promise((resolve, reject) => {
	jwt.verify(token, publicCert, (err, decoded) => {
		if (err) {
			reject(err);
		} else {
			resolve(decoded);
		}
	});
});

checkCertificate()
	.then(getKeys)
	.then(signJWT)
	.then(encryptToken)
	.then(decryptToken)
	.then(verifyJWT)
	.then((data) => {
		console.log('-------------------------------------------------------------------------');
		console.log('Decoded JWT : ', data);
		console.log('-------------------------------------------------------------------------');
	})
	.catch((err) => {
		console.log('Error : ', err);
	});
