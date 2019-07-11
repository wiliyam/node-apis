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

describe("user DELETE method ", () => {
  it("should return 401 when user is unauthenticate", done => {
    chai
      .request(baseUrl)
      .delete("/user/deleteUser")
      .set("content-type", "application/json")
      .field("email", "user@app.com")
      .field("password", "test")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("message");
        done();
      });
  });
  it("should return 400 when user enter invalid email or password", done => {
    chai
      .request(baseUrl)
      .delete("/user/deleteUser")
      .set("content-type", "application/json")
      .set("Authorization", token)
      .field("email", "user1222@app.com")
      .field("password", "test1223")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should return 200 when user is deleted with valid token", done => {
    chai
      .request(baseUrl)
      .delete("/user/deleteUser")
      .set("content-type", "application/json")
      .set("Authorization", token)
      .field("email", "user@app.com")
      .field("password", "test")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
