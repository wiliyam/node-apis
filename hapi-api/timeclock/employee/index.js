const Joi = require("joi");

exports.register = (server, options) => {
  server.route({
    method: "POST",
    path: "/shift",
    config: {
      auth: "simple",
      validate: {
        payload: {
          start: Joi.date()
            .iso()
            .max("now")
            .required(),
          end: Joi.date()
            .iso()
            .min(Joi.ref("start"))
            .max("now")
            .required()
        }
      }
    },
    handler: (request, h) => {
      return {
        payload: request.payload,
        credentials: request.auth.credentials
      };
    }
  });
};

exports.pkg = {
  name: "employee"
};
