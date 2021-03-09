const node_ssh = require("node-ssh").NodeSSH;
const ssh = new node_ssh();
const path = require("path");
const ora = require("ora"); // 加载流程动画
const inquirer = require("inquirer"); //命令行交互
const spinner_style = require("./spinner_style"); //加载动画样式
const { defaultLog, errorLog, successLog } = require("./log"); //Logs
const CONFIG = require("./../config");
/**
 *
 * @param {String} command 命令操作 如 ls
 * @param {String} branchPath 分支的路径 /data/www/branch1
 */
const runCommand = (command, branchPath = "") => {
  return new Promise(async (resolve, reject) => {
    const result = await ssh.exec(command, [], {
      cwd: `/data/www/${branchPath}`,
    });
    // 如果包含这个命令
    if (command.indexOf("ls") !== -1) {
      resolve({ files: result });
    } else {
      resolve(result);
    }
  });
};
/**
 * 连接服务器
 */
const connectSSH = async () => {
  const loading = ora(defaultLog("正在连接服务器")).start();
  loading.spinner = spinner_style.arrow4;
  try {
    await ssh.connect({
      host: CONFIG.SERVER_PATH,
      username: CONFIG.SSH_USER,
      password: CONFIG.PASSWORD,
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
 * 传送文件夹到服务器
 * @param {*} branchPath 分支站点目录
 */
const uploadBySSH = async (branchPath) => {
  //连接ssh
  await connectSSH();
  const PATH = `${CONFIG.PATH}/${branchPath}`; //上传到线上nginx目录的路径
  const loading = ora(defaultLog("准备上传文件")).start();
  const { files } = await runCommand(`ls ${branchPath}`); //获取分支站点目录信息
  if (files) {
    await runCommand("rm -rf *", branchPath); //如果有则清空目录
  }
  loading.spinner = spinner_style.arrow4;
  try {
    await putDirectory(`${global.tar}/dist`, PATH + "/dist");
    successLog("上传成功!");
    //将目标目录的dist里面文件移出到目标文件
    //举个例子 假如我们部署在 /test/html 这个目录下 只有一个网站, 那么上传解压后的文件在 /test/html/dist 里
    //需要将 dist 目录下的文件 移出到 /test/html ;  多网站情况, 如 /test/html/h5  或者 /test/html/admin 都和上面同样道理
    await runCommand(`mv -f ${PATH}/dist/*  ${PATH}`);
    await runCommand(`rm -rf ${PATH}/dist`); //移出后删除 dist 文件夹
    ssh.dispose(); //断开连接
  } catch (error) {
    errorLog(error);
    errorLog("上传失败!");
    process.exit(); //退出流程
  }
  loading.stop();
};
/**
 * 上传文件夹
 * @param {*} local
 * @param {*} remote
 */
const putDirectory = async (local, remote) => {
  return ssh.putDirectory(local, remote, {
    recursive: true,
    concurrency: 10,
    validate: function (itemPath) {
      const baseName = path.basename(itemPath);
      return baseName.substr(0, 1) !== "." && baseName !== "node_modules";
    },
    tick: function (localPath, remotePath, error) {
      if (error) {
        failed.push(localPath);
      } else {
        successful.push(localPath);
      }
    },
  });
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
  uploadBySSH,
};
