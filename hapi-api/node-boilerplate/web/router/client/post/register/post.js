const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const logger = require("winston");
const moment = require("moment");

const client = require("../../../../../models/client");

const i18n = require("../../../../../locales");

const payload = joi
  .object({
    userName: joi
      .string()
      .required()
      .default("user")
      .description("enter username"),
    password: joi
      .required()
      .default("test")
      .description("password for user"),
    conformPassword: joi
      .required()
      .default("test")
      .description("password for user"),
    email: joi
      .required()
      .default("user@app.com")
      .description("user email id"),
    country: joi
      .string()
      .required()
      .default("india")
      .description("user country"),

    deviceId: joi
      .string()
      .required()
      .default("111111111")
      .description("Device Id"),
    deviceType: joi
      .string()
      .required()
      .default("Android")
      .allow(["IOS", "Android", "Web"])
      .description("Android, IOS, Web"),
    deviceMake: joi
      .string()
      .required()
      .default("Samsung")
      .description("Device Make"),
    deviceModel: joi
      .string()
      .required()
      .default("galaxy s6")
      .description("Device Model")
  })
  .required();

const handler = (req, reply) => {
  const dbErrResponse = {
    message: req.i18n.__("genericErrMsg")["500"],
    code: 500
  };
  const userExistrResponse = {
    message: "user already exist",
    code: 400
  };
  const userData = {
    userName: req.payload.userName,
    password: req.payload.password,
    email: req.payload.email,
    country: req.payload.country
  };
  const deviceObj = {
    deviceId: req.payload.deviceId,
    deviceType: req.payload.deviceType,
    deviceMake: req.payload.deviceMake,
    deviceModel: req.payload.deviceModel,
    issuedDate: moment().toDate(),
    expiryDate: moment
      .unix(moment().unix() + req.payload.refreshTokenExpiry)
      .toDate(),
    blackListTill: "",
    refreshToken: ""
  };
  userData["device"] = deviceObj;
  const condition = {
    email: req.payload.email
  };
  if (!req.payload.password === req.payload.conformPassword) {
    return console.log("Password miss match");
  }

  client
    .findOne(condition)
    .then(user => {
      if (user) {
        return reply({ data: userExistrResponse }).code(400);
      }
      client.addClient(userData).then(result => {
        return reply({
          message: "Client successfully created",
          result: result
        }).code(200);
      });
    })
    .catch(err => {
      logger.error("Error while getting user : ", err);
      return reply({ data: dbErrResponse }).code(500);
    });
};
const response = {
  status: {
    200: {
      message: joi.any().default(i18n.__("genericErrMsg")["200"]),
      data: joi
        .object({
          accessToken: joi
            .string()
            .required()
            .default("fdfsaf-fdasf-fdsaf-fasdf")
            .description("Refresh Token"),
          accessExpiry: joi
            .number()
            .required()
            .default(172800)
            .description(
              "Access Token Expiry Time in second (eg. 2 days = 172800)"
            ),
          refreshToken: joi
            .string()
            .required()
            .default(
              "n9040rtjfsdjkg09t4tgoijgklrnglklasngb.4t934thgiuirnnrgreg.fdsg493t234th"
            )
            .description("Access Token"),
          refreshExpiry: joi
            .number()
            .required()
            .default(604800)
            .description(
              "Refresh Token Expiry Time in second (eg. 7 days = 604800)"
            )
        })
        .required()
    },
    500: {
      message: joi.any().default(i18n.__("genericErrMsg")["500"])
    }
  }
}; // swagger response code

module.exports = { payload, handler, response };
