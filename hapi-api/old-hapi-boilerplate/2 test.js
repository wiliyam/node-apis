/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const jose = require('node-jose');
const jwt = require('jsonwebtoken');

const keys = {
	keys:
		[{
			kty: 'oct',
			kid: 'Ynx5TjIh9n9m-uY5mnbFL0cJcCOaAboYcVaIZO5w3Yk',
			k: 'LhrMTMW8fdzjxRszUxC3LvhDzbhyHyoz7QhU7d2gdm0'
		}]
};
// var keystore = jose.JWK.createKeyStore(keys);
const fs = require('fs');

const publicCert = fs.readFileSync('./certs/public.pem');
const privateCert = fs.readFileSync('./certs/private.pem');

const data = { foo: 'bar' };
const token = jwt.sign(data,
	privateCert, {
		expiresIn: 90000,
		subject: 'web',
		algorithm: 'RS256'
	});

jose.JWK.asKey(privateCert, 'pem')
	.then((result) => {
		// {result} is a jose.JWK.Key
		// {result.keystore} is a unique jose.JWK.KeyStore
		//   console.log(result);
		const { keystore } = result;
		// jose.JWK.asKeyStore(keys).
		//     then(function (result) {
		//         // {result} is a jose.JWK.KeyStore
		//         keystore = result;
		const key = keystore.get(0);

		// keystore.asKeyStore(keys).
		//     then(function (result) {
		//         // {result} is a jose.JWK.Key
		//         key = result;
		console.log(key);
		console.log(key.toPEM(true));
		console.log(key.toPEM());
		const input = { foo: 'bar' };
		jose.JWS.createSign({ format: 'compact' }, key)
			.update(JSON.stringify(input), 'utf8')
			.final()
			.then((result) => {
				console.log('Signed : ', result);
				console.log('-------------------------------------------------------------------------');
				// {result} is a JSON object -- JWS using the JSON General Serialization
				jose.JWE.createEncrypt({ format: 'compact', zip: true }, key)
					.update(result, 'utf8')
					.final()
					.then((encrypted) => {
						console.log('encrypted : ', encrypted);
						console.log('-------------------------------------------------------------------------');
						jose.JWE.createDecrypt(key)
							.decrypt(encrypted)
							.then((decrypt) => {
								// console.log("dencrypted : ", decrypt);
								console.log('-------------------------------------------------------------------------');
								console.log('dencrypted payload string: ', decrypt.payload.toString());
								console.log('-------------------------------------------------------------------------');
								jose.JWS.createVerify(key)
									.verify(decrypt.payload.toString())
									.then((data) => {
										// console.log("verify data : ", data);
										console.log('-------------------------------------------------------------------------');
										console.log('verify data payload string: ', data.payload.toString());
										console.log('-------------------------------------------------------------------------');
										// {result} is a Object with:
										// *  header: the combined 'protected' and 'unprotected' header members
										// *  payload: Buffer of the signed content
										// *  signature: Buffer of the verified signature
										// *  key: The key used to verify the signature
									});
								// {result} is a Object with:
								// *  header: the combined 'protected' and 'unprotected' header members
								// *  protected: an array of the member names from the "protected" member
								// *  key: Key used to decrypt
								// *  payload: Buffer of the decrypted content
								// *  plaintext: Buffer of the decrypted content (alternate)
							});
						// {result} is a JSON Object -- JWE using the JSON General Serialization
					});
			})
			.catch((err) => {
				console.log(err);
			});
	});
