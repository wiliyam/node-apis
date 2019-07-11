const handler = (req, h) => {
  req.cookieAuth.clear();

  return h.response({ message: "logout successfully" });
};

module.exports = { handler };
