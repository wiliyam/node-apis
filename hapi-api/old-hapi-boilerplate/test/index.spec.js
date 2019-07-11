
const chai = require('chai');
const { expect } = require('chai');
require('dotenv').config();
const chaiHttp = require('chai-http');

const server = require('../web/server.js');

chai.use(chaiHttp);
// eslint-disable-next-line no-unused-vars
const baseUrl = 'http://localhost:5656';// `${process.env.APP_URL}:${process.env.PORT}`;

// server.register([{
// 	// eslint-disable-next-line global-require
// 	register: require('inject-then')
// }]);

before(async () => {
	await server.init();
	await server.start();
});

describe('Server Check', async () => {
	it('should get user - 404', (done) => {
		chai.request(baseUrl)
			.get('/')
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(404);
				done();
			});
	});
});

after(async (done) => {
	await server.stop();
	process.exit(0);
	done();
});
