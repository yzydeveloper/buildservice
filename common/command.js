const node_ssh = require("node-ssh").NodeSSH;
const ssh = new node_ssh();
const ora = require("ora"); // 加载流程动画
const inquirer = require("inquirer"); //命令行交互
const spinner_style = require("./spinner_style"); //加载动画样式
const { defaultLog, errorLog, successLog } = require("./log"); //Logs

/**
 *
 * @param {String} command 命令操作 如 ls
 */
const runCommand = async (command) => {
  const result = await ssh.exec(command, [], { cwd: "/data/www" });
};
/**
 * 连接服务器
 */
const connectSSH = async () => {
  const loading = ora(defaultLog("正在连接服务器")).start();
  loading.spinner = spinner_style.arrow4;
  try {
    await ssh.connect({
      host: "49.234.49.103",
      username: "root",
      password: "YZYdxf20000722",
    });
    successLog("SSH连接成功!");
  } catch (error) {
    errorLog(error);
    errorLog("SSH连接失败!");
    process.exit(); //退出流程
  }
  loading.stop();
};
/**
 * 选择
 * @param {*} type
 * @param {*} message
 * @param {*} choices
 * @returns
 */
const select = (message = "选择站点", choices = []) => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          message: message,
          name: "env",
          choices: choices,
        },
      ])
      .then((answers) => {
        if (answers) {
          resolve(answers);
        } else {
          reject("配置项有误");
        }
      });
  });
};
module.exports = {
  runCommand,
  connectSSH,
  select,
};
