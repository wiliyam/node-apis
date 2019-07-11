const entity = "client";
const api = require("./patch");
const i18n = require("../../../../locales");

module.exports = [
  /**
   * 'Stripe webhook for handling an event ',
   */
  {
    method: "PATCH",
    path: `/${entity}/update`,
    handler: api.handler,
    vhost: "localhost",
    config: {
      tags: ["api", entity],
      description: i18n.__("apiDescription").clientUpdate,
      notes: i18n.__("apiDescription").clientUpdate,
      //response: api.response,
      validate: {
        //    headers: header.headerLan,
        payload: api.payload,
        //eslint-disable-next-line max-len
        failAction: (req, reply, source, error) =>
          reply({ message: error.output.payload.message }).code(
            error.output.statusCode
          )
      }
    }
  }
];
