const chai = require("chai");
const { expect } = require("chai");
require("dotenv").config();

const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const baseUrl = "http://localhost:5656"; // `${process.env.APP_URL}:${process.env.PORT}`;
const path = "user";

describe("user POST method", async () => {
  it("should create user - 200", done => {
    const body = JSON.stringify({
      appName: "Loademup",
      userId: "5a55ac46cad8ff011ab61a8d",
      userType: "admin",
      deviceId: "111111111",
      deviceType: "IOS",
      deviceMake: "Apple",
      deviceModel: "iPhone 6S",
      multiLogin: false,
      immediateRevoke: false,
      accessTokenExpiry: 172800,
      refreshTokenExpiry: 604800
    });
    chai
      .request(baseUrl)
      .post(`/${path}/login`)
      .set({ lan: "en" })
      .set("content-type", "application/json")
      .send(body)
      .end((err, res) => {
        process.env.refreshToken = res.body.data.refreshToken;
        process.env.accessToken = res.body.data.accessToken;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        done();
      });
  });
});
