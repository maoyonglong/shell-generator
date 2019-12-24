/* eslint-disable */
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        autoprefixer({
            overrideBrowserslist: [
                "iOS >= 8",
                "Firefox >= 20",
                "Android > 4.4"
            ]
        })
    ]
};
