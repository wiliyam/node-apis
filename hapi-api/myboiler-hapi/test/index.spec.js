require("dotenv").config();
const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
process.env.NODE_ENV = "test";
const server = require("../web/server");
const baseUrl = "http://localhost:3000";

before(async () => {
  await server.startServer();
});

describe("Server Check", async () => {
  it("should get user - 404", done => {
    chai
      .request(baseUrl)
      .get("/")
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
after(async done => {
  server.stopServer();
  process.exit(0);
  done();
});
