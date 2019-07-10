const validate = require("./validate");

exports.register = async server => {
  await server.register(require("hapi-auth-jwt2"));
  await server.register(require("@hapi/cookie"));

  let JwtKey = process.env.AUTH_JWT_KEY;
  let cookieKey = process.env.AUTH_COOKIE_KEY;

  server.auth.strategy("jwt2", "jwt", {
    key: JwtKey, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "sid-example",

      // Don't forget to change it to your own secret password!
      password: cookieKey,

      // For working via HTTP in localhost
      isSecure: false
    },

    //redirectTo: "/login",
    appendNext: true
  });

  server.auth.default("session");
};

exports.pkg = {
  name: "auth"
};
