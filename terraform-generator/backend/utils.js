const { exec } = require("child_process");
const { resolve } = require("path");

exports.exec = (command, options) =>
  exec(command, options, (error, stdout, stderr) => {
    if (error) {
      throw new Error(error);
    }
    return stdout.toString();
  });
exports.resolve = resolve;
