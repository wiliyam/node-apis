
const chai = require('chai');
const { expect } = require('chai');
require('dotenv').config();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const baseUrl = 'http://localhost:5656';// `${process.env.APP_URL}:${process.env.PORT}`;
const path = 'user';

describe('user refresh token DELETE PATCH method', async () => {
	it('should blacklist refresh token for 600 seconds - 200', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			refreshToken: process.env.refreshToken,
			time: 600
		});
		chai.request(baseUrl)
			.delete(`/${path}/refreshToken`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});

	it('should activate refresh token - 200', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			refreshToken: process.env.refreshToken
		});
		chai.request(baseUrl)
			.patch(`/${path}/refreshToken`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('should delete refresh token - 200', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			refreshToken: process.env.refreshToken,
			time: 0
		});
		chai.request(baseUrl)
			.delete(`/${path}/refreshToken`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});

	it('should delete refresh token - 404', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			refreshToken: process.env.refreshToken,
			time: 0
		});
		chai.request(baseUrl)
			.delete(`/${path}/refreshToken`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});

	it('should activate refresh token - 404', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			refreshToken: process.env.refreshToken
		});
		chai.request(baseUrl)
			.patch(`/${path}/refreshToken`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				expect(res).to.have.status(404);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});
});
