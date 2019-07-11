const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

const moment = require("moment");

const Boom = require("boom");
const user = require("../../../../../models/user");
const bcrypt = require("bcrypt");

const salt = 10;

const payload = joi
  .object({
    userName: joi
      .string()
      .required()
      .default("user")
      .description("enter username"),
    password: joi
      .string()
      .min(3)
      .max(15)
      .required()
      .default("test")
      .description("password for user"),
    conformPassword: joi
      .string()
      .min(3)
      .max(15)
      .required()
      .default("test")
      .description("conform password for user"),
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

const handler = async (req, h) => {
  const userData = {
    userName: req.payload.userName,
    email: req.payload.email,
    country: req.payload.country,
    admin: true
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
  userData["password"] = await bcrypt.hash(req.payload.password, salt);
  return new Promise((resolve, reject) => {
    user
      .findOne(condition)
      .then(data => {
        if (data) return resolve(Boom.conflict("User already6 exist"));

        user.addUser(userData).then(result => {
          return resolve(
            h.response({ message: "Account successfully created.." })
          );
        });
      })
      .catch(err => {
        reject(Boom.badImplementation(err));
      });
  });
};

module.exports = { payload, handler };
