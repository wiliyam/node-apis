const joi = require("joi");
const logger = require("winston");
const client = require("../../../../models/client");
const i18n = require("../../../../locales");

const handler = (req, reply) => {
  const data = { userName: 1, _id: 0 };
  client
    .findAll({}, data)
    .then(clientData => {
      if (!clientData) return reply({ result: "No data found" });
      return reply({
        result: clientData
      }).code(200);
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

module.exports = { handler, response };
