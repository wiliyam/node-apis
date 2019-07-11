const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const logger = require("winston");
const client = require("../../../../models/client");
const i18n = require("../../../../locales");

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

const handler = (req, reply) => {
  const condition = {
    email: req.payload.email,
    password: req.payload.password
  };

  client
    .findOne(condition)
    .then(clientData => {
      if (!clientData) return reply({ message: "No user found.." }).code(400);
      client.remove({ email: condition.email }).then(result => {
        if (!result)
          return reply({ message: "some thing went wrong" }).code(400);
        return reply({ message: "User Deleted successfull" }).code(200);
      });
    })
    .catch(e => {
      logger.error("User Sync API error =>", e);
      return reply({ message: e.message }).code(e.code);
    });
};

const response = {
  status: {
    200: {
      message: joi.any().default(i18n.__("genericErrMsg")["200"]),
      data: joi
        .object({
          username: joi.required(),
          email: joi.required()
        })
        .required()
    },
    500: {
      message: joi.any().default(i18n.__("genericErrMsg")["500"])
    }
  }
}; // swagger response code

module.exports = { payload, handler, response };
