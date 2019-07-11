require("dotenv").config();
const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const baseUrl = "http://localhost:3000";

describe("user POST method for Registration", () => {
  it("should return 400 when wrong input or no input passes", done => {
    chai
      .request(baseUrl)
      .post("/user/register")
      .set("content-type", "application/json")
      .field("userName", "user")
      .field("password", "test")
      .field("conformPassword", "test")
      .field("email", "user@app.com")

      .field("deviceType", "Android")
      .field("deviceMake", "Sumsung")
      .field("deviceModel", "galaxy s6")
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message");
        done();
      });
  });
  it("should return 200 when new user registred successfully", done => {
    chai
      .request(baseUrl)
      .post("/user/register")
      .set("content-type", "application/json")
      .field("userName", "user")
      .field("password", "test")
      .field("conformPassword", "test")
      .field("email", "user@app.com")
      .field("country", "india")
      .field("deviceId", "111111111")
      .field("deviceType", "Android")
      .field("deviceMake", "Sumsung")
      .field("deviceModel", "galaxy s6")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("should return 409 user already exist", done => {
    chai
      .request(baseUrl)
      .post("/user/register")
      .set("content-type", "application/json")
      .field("userName", "user")
      .field("password", "test")
      .field("conformPassword", "test")
      .field("email", "user@app.com")
      .field("country", "india")
      .field("deviceId", "111111111")
      .field("deviceType", "Android")
      .field("deviceMake", "Sumsung")
      .field("deviceModel", "galaxy s6")
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  // it("should return 401 when  user is unauthorize", done => {
  //   chai
  //     .request(baseUrl)
  //     .get("/user/getUser")
  //     .set("content-type", "application/json")
  //     .end((err, res) => {
  //       expect(res).to.have.status(401);
  //       done();
  //     });
  // });
});
