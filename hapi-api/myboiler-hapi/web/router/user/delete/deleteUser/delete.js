const joi = require("joi");
const Boom = require("boom");
const bcrypt = require("bcrypt");
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
    email: req.payload.email
  };
  // return new Promise((resolve, reject) => {
  //   user
  //     .findOne(condition)
  //     .then(userData => {
  //       if (!userData)
  //         return resolve(Boom.badRequest("no user found with given data"));
  //       user.remove({ email: condition.email }).then(result => {
  //         if (!result)
  //           return resolve(Boom.badRequest("check your email and password"));
  //         return resolve({ message: "User Deleted successfull" });
  //       });
  //     })
  //     .catch(err => {
  //       reject(Boom.badImplementation(err));
  //     });
  // });
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
            user.findOne(condition).then(userData => {
              if (!userData)
                return resolve(
                  Boom.badRequest("no user found with given data")
                );
              user.remove({ email: condition.email }).then(result => {
                if (!result)
                  return resolve(
                    Boom.badRequest("check your email and password")
                  );
                return resolve({ message: "User Deleted successfull" });
              });
            });
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

module.exports = { handler, payload };
