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
      .default("name@email.com")
      .description("user email here"),
    password: joi
      .required()
      .default("5a55ac46cad8ff011ab61a8d")
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

const handler = (req, reply) => {
  const condition = {
    email: req.payload.email,
    password: req.payload.password
  };
  newdata = {
    userName: req.payload.name,
    country: req.payload.country
  };
  client
    .findOneAndUpdate(condition, { $set: newdata })
    .then(clientData => {
      if (clientData.lastErrorObject.n != 0)
        return reply({ result: "successfully updated" });
      return reply({
        result: "something went wrong",
        message: "check you email and password"
      }).code(400);
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
      data: joi.object().required()
    },
    500: {
      message: joi.any().default(i18n.__("genericErrMsg")["500"])
    }
  }
}; // swagger response code

module.exports = { payload, handler, response };
