const user = require("../../models/user");
const { ObjectID } = require("mongodb");

const validate = async function(decoded, request) {
  id = new ObjectID(decoded.id);

  console.log("i am running.............................");

  try {
    userData = await user.findOne({ _id: id });
    if (userData) {
      return {
        isValid: true,
        credentials: { email: userData.email, isAdmin: userData.admin }
      };
    } else {
      return { isValid: false };
    }
  } catch (error) {
    return { isValid: false };
  }
};

module.exports = validate;
