const { execSync } = require("child_process");
const { resolve } = require("path");

exports.exec = (...args) => execSync(...args).toString();
exports.resolve = resolve;
