const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const logger = require("winston");
const client = require("../../../../../models/client");
const i18n = require("../../../../../locales");
joi.objectId = require("joi-objectid")(joi);
const { ObjectID } = require("mongodb");

const payload = joi
  .object({
    email: joi
      .string()
      .required()
      .default("user@app.com")
      .description("user Email here"),
    password: joi
      .required()
      .default("test")
      .description("put password here"),
    userType: joi
      .string()
      .required()
      .default("admin")
      .description("user type like customer, admin, provider"),
    multiLogin: joi
      .boolean()
      .required()
      .default(false)
      .description(
        "user can able to login in multi device with same credentials"
      ),
    immediateRevoke: joi
      .boolean()
      .required()
      .default(false)
      .description("user can use access token after revoking refresh token"),
    deviceId: joi
      .string()
      .required()
      .default("111111111")
      .description("Device Id"),
    deviceType: joi
      .string()
      .required()
      .default("IOS")
      .allow(["IOS", "Android", "Web"])
      .description("Android, IOS, Web"),
    deviceMake: joi
      .string()
      .required()
      .default("Apple")
      .description("Device Make"),
    deviceModel: joi
      .string()
      .required()
      .default("iPhone 6S")
      .description("Device Model"),
    accessTokenExpiry: joi
      .number()
      .required()
      .default(172800)
      .description("Access Token Expiry Time in second (eg. 2 days = 172800)"),
    refreshTokenExpiry: joi
      .number()
      .required()
      .default(604800)
      .description("Refresh Token Expiry Time in second (eg. 7 days = 604800)")
  })
  .required();

const handler = (req, reply) => {
  const condition = {
    email: req.payload.email,
    password: req.payload.password
  };

  let userId;
  client
    .findOne(condition)
    .then(clientData => {
      if (!clientData) return reply({ message: "No user found.." }).code(400);
      userId = new ObjectID(clientData._id);
    })
    .catch(e => {
      logger.error("User Sync API error =>", e);
      return reply({ message: e.message }).code(e.code);
    });

  let accessToken = "";
  const userData = {
    $set: {
      userId: userId,
      multiLogin: req.payload.multiLogin || false,
      immediateRevoke: req.payload.immediateRevoke || false,
      userType: req.payload.userType,
      accessTokenExpiry: req.payload.accessTokenExpiry,
      refreshTokenExpiry: req.payload.refreshTokenExpiry
    }
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
  const tokenData = {
    userId: userId.toString(),
    userType: req.payload.userType,
    deviceId: req.payload.deviceId,
    accessCode: "",
    multiLogin: req.payload.multiLogin,
    immediateRevoke: req.payload.immediateRevoke
  };
  const generateRefreshToken = () =>
    new Promise((resolve, reject) => {
      auth
        .generateRefreshToken(tokenData, req.payload.refreshTokenExpiry)
        .then(token => {
          deviceObj.refreshToken = token;
          tokenData.accessCode = token;
          resolve(true);
        })
        .catch(err => {
          logger.error("Error in generating refresh token : ", err);
          return reject(dbErrResponse);
        });
    }); // generate Refresh token
  const generateAccessToken = () =>
    new Promise((resolve, reject) => {
      auth
        .generateAccessToken(tokenData, req.payload.accessTokenExpiry)
        .then(token => {
          accessToken = token;
          resolve(token);
        })
        .catch(err => {
          logger.error("Error in generating access token : ", err);
          return reject(dbErrResponse);
        });
    }); // generate Access token
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
