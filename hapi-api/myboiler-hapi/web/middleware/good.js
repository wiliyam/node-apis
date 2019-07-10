const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    myConsoleReporter: [
      {
        module: "@hapi/good-console"
      },
      "stdout"
    ]
  }
};

module.exports = {
  plugin: require("@hapi/good"),
  options
};
