const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const user = require("../../../../../models/user");
const Boom = require("boom");
const bcrypt = require("bcrypt");

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
      .description("put password here"),
    name: joi
      .string()
      .default("abc")
      .required()
      .description("put new name here"),
    country: joi
      .string()
      .default("india")
      .required()
      .description("put new country here")
  })
  .required();

const handler = (req, h) => {
  const condition = {
    email: req.payload.email
  };
  newdata = {
    userName: req.payload.name,
    country: req.payload.country
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
            user
              .findOneAndUpdate(condition, { $set: newdata })
              .then(clientData => {
                if (clientData.lastErrorObject.n != 0)
                  return resolve({ message: "successfully updated" });
                return resolve(
                  Boom.badRequest(
                    "Some thing went wrong check your email and password.."
                  )
                );
              });
          } else {
            return resolve(Boom.badRequest("wrong email id and password"));
          }
        });
      })
      .catch(err => {
        reject(Boom.badImplementation(err));
      });
  });
};

module.exports = { payload, handler };
