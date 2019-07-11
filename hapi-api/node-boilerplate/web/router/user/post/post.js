const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const logger = require("winston");
const moment = require("moment");
const { ObjectID } = require("mongodb");

const user = require("../../../../models/users");
const auth = require("../../../middleware/authentication");
const i18n = require("../../../../locales");

const payload = joi
  .object({
    appName: joi
      .string()
      .required()
      .default("Loademup")
      .description("App Name"),
    userId: joi
      .objectId()
      .required()
      .default("5a55ac46cad8ff011ab61a8d")
      .description("Mongo Id of user"),
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
  const dbErrResponse = {
    message: req.i18n.__("genericErrMsg")["500"],
    code: 500
  };

  let accessToken = "";
  const userData = {
    $set: {
      userId: new ObjectID(req.payload.userId),
      appName: req.payload.appName,
      multiLogin: req.payload.multiLogin || false,
      immediateRevoke: req.payload.immediateRevoke || false,
      userType: req.payload.userType,
      accessTokenExpiry: req.payload.accessTokenExpiry,
      refreshTokenExpiry: req.payload.refreshTokenExpiry
    }
  }; // prepare user object

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
  const condition = {
    userId: new ObjectID(req.payload.userId),
    appName: req.payload.appName,
    userType: req.payload.userType
  };

  const tokenData = {
    userId: req.payload.userId.toString(),
    appName: req.payload.appName,
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

  const checkUser = () =>
    new Promise((resolve, reject) => {
      if (req.payload.multiLogin === true) {
        const condGet = Object.assign({}, condition);
        condGet["activeDevices.deviceId"] = req.payload.deviceId;
        user
          .findOne(condGet, userData)
          .then(data => {
            if (data) {
              condition["activeDevices.deviceId"] = req.payload.deviceId;
              userData.$set["activeDevices.$"] = deviceObj;
            } else {
              userData.$push = {
                activeDevices: deviceObj
              };
            }
            return resolve(true);
          })
          .catch(err => {
            logger.info("Error while getting user : ", err);
            return reject(dbErrResponse);
          });
      } else {
        userData.$set.activeDevices = [deviceObj];
        return resolve(true);
      }
    });

  const updateUser = () =>
    new Promise((resolve, reject) => {
      user
        .findOneAndUpdate(condition, userData)
        .then(data => resolve(data))
        .catch(err => {
          logger.info("Error while updating user : ", err);
          return reject(dbErrResponse);
        });
    });

  generateRefreshToken()
    .then(generateAccessToken)
    .then(checkUser)
    .then(updateUser)
    .then(() => {
      const responseData = {
        refreshToken: deviceObj.refreshToken,
        accessToken,
        accessExpiry: req.payload.accessTokenExpiry,
        refreshExpiry: req.payload.refreshTokenExpiry
      };
      return reply({
        message: req.i18n.__("genericErrMsg")["200"],
        data: responseData
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
