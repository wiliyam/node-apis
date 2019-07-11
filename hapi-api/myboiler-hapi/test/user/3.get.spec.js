require("dotenv").config();
const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const jwt = require("jsonwebtoken");
const config = require("config");

const baseUrl = "http://localhost:3000";

function getToken(email, admin) {
  let JwtKey = config.get("jwtPrivateKey");

  return jwt.sign(
    {
      email: email,
      isAdmin: admin
    },
    JwtKey,
    { expiresIn: "1h" }
  );
}
let email = "user@app.com";
let admin = true;
let token = getToken(email, admin);
describe("user GET method ", () => {
  it("should return 401 when user is unauthenticate or passinvalid token", done => {
    chai
      .request(baseUrl)
      .get("/user/getUser")
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should return 200 when user is authenticate and pass valid token", done => {
    chai
      .request(baseUrl)
      .get("/user/getUser")
      .set("content-type", "application/json")
      .set("Authorization", token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("users");
        done();
      });
  });
});
