const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const user = require("../../../../../models/user");
const bcrypt = require("bcrypt");
const Boom = require("boom");
const jwt = require("jsonwebtoken");
const config = require("config");

joi.objectId = require("joi-objectid")(joi);

const payload = joi.object({
  email: joi
    .string()
    .required()
    .default("user@app.com")
    .description("user Email here"),
  password: joi
    .required()
    .default("test")
    .description("put password here")
});

function getToken(id, email, admin) {
  let JwtKey = config.get("jwtPrivateKey");

  return jwt.sign(
    {
      id: id,
      email: email,
      isAdmin: admin
    },
    JwtKey,
    { expiresIn: "1h" }
  );
}
const handler = async (req, h) => {
  const condition = {
    email: req.payload.email
  };

  return new Promise((resolve, reject) => {
    user
      .findOne(condition)
      .then(userData => {
        if (!userData)
          return resolve(Boom.badRequest("Email or Password invalid"));
        bcrypt.compare(req.payload.password, userData.password, function(
          err,
          res
        ) {
          if (res) {
            let token = getToken(userData._id, userData.email, userData.admin);
            //req.cookieAuth.set({ token: token });
            return resolve(
              h
                .response({
                  message: "sucessfully login",
                  token: token
                })
                .state("token", token)
                .header("Authorization", token)
            );
          } else {
            return resolve(Boom.unauthorized("wrong email id and password"));
          }
        });
      })
      .catch(err => {
        reject(Boom.badImplementation(err));
      });
  });
};

module.exports = { payload, handler };
