const moment = require("moment");
const uuidv4 = require("uuid/v4");
const { ObjectID } = require("mongodb");
const jwt = require("./hapi-jwt-jwe");
const user = require("../../models/users");
const config = require("../../config");

const auth = {};

module.exports = auth;

/**
 * Method to generate a Access token
 * @param {*} data - the claims to be included in the token
 * @param {*} accessTokenExpiry - expiry time for access token
 */
auth.generateAccessToken = (data, accessTokenExpiry) =>
  new Promise((resolve, reject) => {
    jwt
      .generateJWT(
        data,
        data.userType,
        accessTokenExpiry || config.auth.accessExpiry
      )
      .then(token => {
        // updateAccessCode(type, data, () => {
        // });//asynchronously update the access code in respective databae documents
        resolve(token);
      })
      .catch(err => {
        reject(err);
      });
  });

/**
 * Method to generate a Refresh token
 */
// eslint-disable-next-line no-unused-vars
auth.generateRefreshToken = () =>
  new Promise((resolve, _reject) => {
    const refreshToken = uuidv4();
    return resolve(refreshToken);
  });

/**
 * Method to validate the Access Token
 * @param {*} decoded - decoded token
 * @param {*} req - request object
 * @param {*} cb - callback
 */
const validateAccessToken = (decoded, req, cb) => {
  const unAuth = { message: req.i18n.__("genericErrMsg")["401"], code: 401 };
  const invalidCode = {
    message: req.i18n.__("genericErrMsg")["417"],
    code: 417
  };
  const notAllowed = {
    message: req.i18n.__("genericErrMsg")["403"],
    code: 403
  };
  const dbErrResponse = {
    message: req.i18n.__("genericErrMsg")["500"],
    code: 500
  };

  if (decoded.exp > moment().unix()) {
    return cb(notAllowed, false);
  }
  if (decoded.accessCode === req.headers.refreshtoken) {
    const condition = {
      userId: new ObjectID(decoded.userId),
      appName: decoded.appName,
      userType: decoded.userType,
      activeDevices: {
        $elemMatch: {
          deviceId: decoded.deviceId,
          refreshToken: decoded.accessCode,
          expiryDate: { $gte: moment().toDate() },
          blackListTill: ""
        }
      }
    };
    user
      .findOne(condition)
      .then(userData => {
        if (userData) {
          return cb(null, true, decoded);
        }
        return cb(unAuth, false);
        // eslint-disable-next-line no-unused-vars
      })
      .catch(_err => cb(dbErrResponse, false));
  } else {
    return cb(invalidCode, false);
  }
};

auth.accessToken = {
  key: jwt.publicCert,
  validateFunc: validateAccessToken,
  verifyOptions: { algorithms: ["RS256"], ignoreExpiration: true }
};

auth.authJWT = jwt;

module.exports = auth;
