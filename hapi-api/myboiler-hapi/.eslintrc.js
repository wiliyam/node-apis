module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true,
        "mocha": true,
        "es6": true
    },
    "plugins": [
        "chai-friendly"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "no-tabs": 0,
        "linebreak-style": "off",
        "comma-dangle": 0,
        "consistent-return": 0,
        "function-paren-newline": [
            "error",
            "never"
        ],
        // "implicit-arrow-linebreak": [
        //     "off"
        // ],
        "no-param-reassign": 0,
        "no-underscore-dangle": 0,
        "no-shadow": 0,
        // "no-plusplus": 0,
        "chai-friendly/no-unused-expressions": 2
    }
};