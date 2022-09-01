const chalk = require('chalk')
// 命令行颜色
const defaultLog = (log) =>
    console.log(chalk.blue(`---------------- ${log} ----------------`))
const errorLog = (log) =>
    console.log(chalk.red(`---------------- ${log} ----------------`))
const successLog = (log) =>
    console.log(chalk.green(`---------------- ${log} ----------------`))
module.exports = {
    defaultLog,
    errorLog,
    successLog,
}
