
const chai = require('chai');
const { expect } = require('chai');
require('dotenv').config();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const baseUrl = 'http://localhost:5656';// `${process.env.APP_URL}:${process.env.PORT}`;
const path = 'user';

describe('user GET method', async () => {
	it('should get user - 200', (done) => {
		chai.request(baseUrl)
			.get(`/${path}/Loademup/admin/5a55ac46cad8ff011ab61a8d`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('should get user - 404', (done) => {
		chai.request(baseUrl)
			.get(`/${path}/Karry/admin/5a55ac46cad8ff011ab61a8d`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});
});
