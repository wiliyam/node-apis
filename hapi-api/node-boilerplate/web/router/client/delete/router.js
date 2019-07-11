const entity = "client";
const api = require("./delete");
const i18n = require("../../../../locales");

module.exports = [
  /**
   * 'Stripe webhook for handling an event ',
   */
  {
    method: "DELETE",
    path: `/${entity}/delete`,
    handler: api.handler,
    vhost: "localhost",
    config: {
      tags: ["api", entity],
      description: i18n.__("apiDescription").clientDelete,
      notes: i18n.__("apiDescription").clientDelete,
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
