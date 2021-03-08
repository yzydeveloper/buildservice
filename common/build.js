const ora = require("ora"); // 加载流程动画
const shell = require("shelljs"); // 执行shell命令
const spinner_style = require("./spinner_style"); //加载动画样式
const pinyin = require("pinyin");
const { defaultLog, errorLog, successLog } = require("./log"); //Logs
const { getMaxDiskInfo } = require("./disk"); //获取磁盘信息
const { hasCatalog, readdir, mkdir } = require("./node_app");
const Git = require("./git");
/**
 * 初始化项目
 */
const download = async () => {
  try {
    defaultLog("正在初始化目录");
    const { data } = await getMaxDiskInfo(); //获取磁盘信息
    const tar = `${data.mounted}/build/gitroot/${global.ext}`;
    // 设置全局的站点路径
    global.tar = tar;
    // 是否存在这个目录
    const isExists = await hasCatalog(tar);
    if (!isExists) {
      await mkdir(tar);
    }
    // 获取目标文件夹中是否有文件
    const file = await readdir(tar);
    // 无文件则拉代码
    var loading = ora(defaultLog("正在初始化站点")).start();
    loading.spinner = spinner_style.arrow4;
    if (!file.length) {
      await Git.clone(global.gitPath, tar);
    } else {
      // 有则切分支或拉代码
    }
    successLog("初始化成功");
  } catch (error) {
    errorLog(error);
    process.exit(); //退出流程
  }
  loading.stop();
};
/**
 *
 * @param {*} path 绝对路径
 */
const install = async (path) => {
  const loading = ora(defaultLog("下载依赖")).start();
  loading.spinner = spinner_style.arrow4;
  shell.cd(path);
  const res = await shell.exec("npm install"); //执行shell 打包命令
  loading.stop();
  if (res.code === 0) {
    successLog("依赖下载完成!");
  } else {
    errorLog("依赖下载失败, 请重试!");
    process.exit(); //退出流程
  }
};
/**
 *
 * @param {*} path 绝对路径
 */
const compileDist = async (path) => {
  const loading = ora(defaultLog("项目开始打包")).start();
  loading.spinner = spinner_style.arrow4;
  shell.cd(path);
  const res = await shell.exec("npm run build"); //执行shell 打包命令
  loading.stop();
  if (res.code === 0) {
    successLog("项目打包成功!");
  } else {
    errorLog("项目打包失败, 请重试!");
    process.exit(); //退出流程
  }
};
// console.log(
//   PIN_YIN("0122yzy功能模块", {
//     style: PIN_YIN.STYLE_INITIALS, // 设置拼音风格
//   })
// );
module.exports = {
  download,
  compileDist,
  install,
};
