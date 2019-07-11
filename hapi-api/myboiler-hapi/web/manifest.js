const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const router = require("./router");
const middleware = require("./middleware");

const config = require("config");

module.exports = {
  server: {
    port: config.get("port")
  },
  register: {
    plugins: [
      middleware.good,
      inert,
      vision,
      middleware.swagger,
      middleware.auth,
      router.user.post.register,
      router.user.post.login,
      router.user.patch.updateUser,
      router.user.get.getUser,
      router.user.del.deleteUser
      //router.user.logoutUser
    ]
  }
};
