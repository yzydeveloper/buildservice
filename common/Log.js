const Chalk = require("chalk"); //命令行颜色
const DefaultLog = (log) =>
  console.log(Chalk.blue(`---------------- ${log} ----------------`));
const ErrorLog = (log) =>
  console.log(Chalk.red(`---------------- ${log} ----------------`));
const SuccessLog = (log) =>
  console.log(Chalk.green(`---------------- ${log} ----------------`));
module.exports = {
  DefaultLog,
  ErrorLog,
  SuccessLog,
};
