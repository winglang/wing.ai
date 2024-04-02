const { execSync } = require("node:child_process");
const { resolve } = require("path");

exports.exec = (...args) => execSync(...args).toString();
exports.resolve = resolve;
