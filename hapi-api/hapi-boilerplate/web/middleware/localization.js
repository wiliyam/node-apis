const hapiI18n = require("hapi-i18n");
const config = require("../../config");

const defaultLan = config.localization.DEFAULT_LANGUAGE;
const languages = config.localization.LANGUAGES;

const i18n = {
  register: hapiI18n,
  options: {
    locales: languages.split("."),
    directory: "./locales",
    languageHeaderField: "lan",
    defaultLocale: defaultLan
  }
};

module.exports = { i18n, defaultLan };
