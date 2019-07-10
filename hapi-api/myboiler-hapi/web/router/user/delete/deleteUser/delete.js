const joi = require("joi");
const Boom = require("boom");

const user = require("../../../../../models/user");

const payload = joi
  .object({
    email: joi
      .string()
      .required()
      .default("user@app.com")
      .description("user email here"),
    password: joi
      .required()
      .default("test")
      .description("put password here")
  })
  .required();
const handler = (req, h) => {
  const condition = {
    email: req.payload.email,
    password: req.payload.password
  };
  return new Promise((resolve, reject) => {
    user
      .findOne(condition)
      .then(userData => {
        if (!userData)
          return resolve(Boom.badRequest("no user found with given data"));
        user.remove({ email: condition.email }).then(result => {
          if (!result)
            return resolve(Boom.badRequest("check your email and password"));
          return resolve({ message: "User Deleted successfull" });
        });
      })
      .catch(err => {
        reject(Boom.badImplementation(err));
      });
  });
};

module.exports = { handler, payload };
