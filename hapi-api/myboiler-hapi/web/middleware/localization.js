const config = require("../../config");

const defaultLan = config.localization.DEFAULT_LANGUAGE;
const languages = config.localization.LANGUAGES;

const i18n = {
  plugin: require("hapi-i18n"),
  options: {
    locales: String(languages).split(","),
    directory: "./locales",
    languageHeaderField: "lan",
    defaultLocale: defaultLan
  }
};

module.exports = { i18n, defaultLan };
