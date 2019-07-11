// load .env in local development
require("dotenv").config();

const logger = require("winston");
const semver = require("semver");
const pkg = require("./package.json");

// validate Node version requirement
const runtime = {
  expected: semver.validRange(pkg.engines.node),
  actual: semver.valid(process.version)
};

const valid = semver.satisfies(runtime.actual, runtime.expected);
if (!valid) {
  throw new Error(
    `Expected Node.js version ${runtime.expected}, but found v${
      runtime.actual
    }. Please update or change your runtime!`
  );
}

// configure  logger
const type = process.env.AUTH_PROCESS_TYPE;

logger.log({
  level: "info",
  message: `Starting ${type} process id:${process.pid}`
});

if (type === "web") {
  require("./web");
} else if (type === "worker") {
  require("./worker");
} else {
  throw new Error(`${type} is an unsupported process type.`);
}
