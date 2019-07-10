const user = require("../../../../../models/user");
const Boom = require("boom");
const jwt = require("jsonwebtoken");

const handler = (req, h) => {
  const dataOnly = { userName: 1, _id: 0 };
  let JwtKey = process.env.AUTH_JWT_KEY;
  const token = req.auth.credentials.token;
  var decoded = jwt.verify(token, JwtKey);

  //console.log("credentials", decoded);
  return new Promise((resolve, reject) => {
    if (decoded.isAdmin) {
      user
        .findAll({}, dataOnly)
        .then(userdata => {
          if (userdata.length < 1)
            return resolve({ Message: "No user data found" });
          return resolve({
            users: userdata
          }).code(200);
        })
        .catch(err => {
          reject(Boom.badImplementation(err));
        });
    } else {
      resolve(Boom.illegal("You dont have adminstration privileges"));
    }
  });
};

module.exports = { handler };
