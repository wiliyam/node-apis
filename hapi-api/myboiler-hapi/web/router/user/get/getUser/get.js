const user = require("../../../../../models/user");
const Boom = require("boom");

const handler = (req, h) => {
  const dataOnly = { userName: 1, _id: 0 };

  // console.log("credentials", h.request.auth.credentials); //get credentials from validation
  return new Promise((resolve, reject) => {
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
  });
};

module.exports = { handler };
