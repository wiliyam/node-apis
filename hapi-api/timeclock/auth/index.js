const service = require("./service");

exports.register = async function(server) {
  await server.register(require("bell"));
  await server.register(require("hapi-auth-basic"));
  await server.register(require("hapi-auth-cookie"));

  server.auth.strategy("simple", "basic", {
    validate: service.validate
  });
  server.auth.strategy("github", "bell", {
    provider: "github",
    password: "cookie_encryption_password_secure",
    clientId: "2beb434df71f614be074",
    clientSecret: "f6f622cbd810061270f50fe66f97235b890e57f1",
    location: "https://example.com",
    scope: []
  });

  server.auth.strategy("session", "cookie", {
    password: "password-should-be-32-characters",
    redirectTo: "/",
    appendNext: true,
    isSecure: false
  });

  server.route({
    method: "GET",
    path: "/login",
    options: {
      auth: "github",
      handler: function(request, h) {
        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }

        request.cookieAuth.set({
          username: request.auth.credentials.profile.email
        });

        const next = request.auth.credentials.query.next
          ? request.auth.credentials.query.next
          : "/home";

        return h.redirect(next);
      }
    }
  });

  server.route({
    method: "GET",
    path: "/logout",
    config: {
      auth: "session"
    },
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    }
  });
};

exports.pkg = {
  name: "auth"
};
