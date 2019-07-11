
const chai = require('chai');
const { expect } = require('chai');
require('dotenv').config();
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const baseUrl = 'http://localhost:5656';// `${process.env.APP_URL}:${process.env.PORT}`;
const path = 'user';

describe('user GET method', async () => {
	let refreshTokenOld = '';
	let accessTokenOld = '';

	const delay = interval => it('should delay', (done) => {
		setTimeout(() => done(), interval);
	}).timeout(interval + 100);
	// The extra 100ms should guarantee the test will not fail due to exceeded timeout

	it('should create user - 200', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			deviceId: '111111111',
			deviceType: 'IOS',
			deviceMake: 'Apple',
			deviceModel: 'iPhone 6S',
			multiLogin: false,
			immediateRevoke: false,
			accessTokenExpiry: 1,
			refreshTokenExpiry: 604800
		});
		chai.request(baseUrl)
			.post(`/${path}/login`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				refreshTokenOld = res.body.data.refreshToken;
				process.env.refreshToken = res.body.data.refreshToken;
				accessTokenOld = res.body.data.accessToken;
				process.env.accessToken = res.body.data.accessToken;
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).to.have.property('data');
				done();
			});
	});

	delay(1000);

	it('should get new access token for user - 200', (done) => {
		chai.request(baseUrl)
			.get(`/${path}/accessToken`)
			.set({ lan: 'en', authorization: process.env.accessToken, refreshtoken: process.env.refreshToken })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('should get new access token for user - 417', (done) => {
		chai.request(baseUrl)
			.get(`/${path}/accessToken`)
			.set({ lan: 'en', authorization: process.env.accessToken, refreshtoken: Math.random() })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(417);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});

	it('should create user - 200', (done) => {
		const body = JSON.stringify({
			appName: 'Loademup',
			userId: '5a55ac46cad8ff011ab61a8d',
			userType: 'admin',
			deviceId: '111111111',
			deviceType: 'IOS',
			deviceMake: 'Apple',
			deviceModel: 'iPhone 6S',
			multiLogin: false,
			immediateRevoke: false,
			accessTokenExpiry: 17900,
			refreshTokenExpiry: 604800
		});
		chai.request(baseUrl)
			.post(`/${path}/login`)
			.set({ lan: 'en' })
			.set('content-type', 'application/json')
			.send(body)
			.end((err, res) => {
				process.env.refreshToken = res.body.data.refreshToken;
				process.env.accessToken = res.body.data.accessToken;
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('message');
				expect(res.body).to.have.property('data');
				done();
			});
	});

	it('should get new access token for user - 403', (done) => {
		chai.request(baseUrl)
			.get(`/${path}/accessToken`)
			.set({ lan: 'en', authorization: process.env.accessToken, refreshtoken: process.env.refreshToken })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(403);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});

	it('should get new access token for user - 401', (done) => {
		chai.request(baseUrl)
			.get(`/${path}/accessToken`)
			.set({ lan: 'en', authorization: accessTokenOld, refreshtoken: refreshTokenOld })
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.property('message');
				expect(res.body).not.to.have.property('data');
				done();
			});
	});
});
