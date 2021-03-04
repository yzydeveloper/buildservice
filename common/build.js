const ora = require("ora"); // 加载流程动画
const spinner_style = require("./spinner_style"); //加载动画样式
const pinyin = require("pinyin");
const { defaultLog, errorLog, successLog } = require("./log"); //Logs
const { getMaxDiskInfo } = require("./disk"); //获取磁盘信息
const { hasCatalog, readdir, mkdir } = require("./node_app");
const { clone } = require("./git");
const download = async () => {
  try {
    defaultLog("正在初始化目录");
    const { data } = await getMaxDiskInfo(); //获取磁盘信息
    const tar = `${data.mounted}/build/gitroot/${global.ext}`;
    // 是否存在这个目录
    const isExists = await hasCatalog(tar);
    if (!isExists) {
      await mkdir(tar);
    }
    // 获取目标文件夹中是否有文件
    const file = await readdir(tar);
    // 无文件则拉代码
    var loading = ora(defaultLog("正在下载文件")).start();
    loading.spinner = spinner_style.arrow4;
    if (!file.length) {
      await clone(global.gitPath, tar);
    } else {
      // 有则切分支或拉代码
    }
    successLog("下载成功");
  } catch (error) {
    errorLog(error);
    process.exit(); //退出流程
  }
  loading.stop();
};
// console.log(
//   PIN_YIN("0122yzy功能模块", {
//     style: PIN_YIN.STYLE_INITIALS, // 设置拼音风格
//   })
// );
module.exports = {
  download,
};
