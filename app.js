const ora = require("ora"); // 加载流程动画
const spinner_style = require("./common/spinner_style"); //加载动画样式
const { defaultLog, errorLog, successLog } = require("./common/log"); //Logs
const { download } = require("./common/build");
const { select } = require("./common/command");
const Git = require("./common/git");
const siteList = [
  {
    name: "PC",
    value: "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/PC.git",
  },
  {
    name: "H5",
    value: "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/h5.git",
  },
];
/**
 * 拉代码流程
 */
async function gitPull() {
  try {
    const newGit = new Git(global.tar); //实例化git
    await newGit.init(); //初始化git
    const branchesList = newGit.remoteBranches.map((item) => {
      return {
        name: item.name.split("/").reverse()[0],
        value: item.fullName,
      };
    });
    const { env } = await select("选择分支名称", branchesList); //选择分支
    let selected = env.split("/").reverse()[0];
    var loading = ora(defaultLog("正在拉取代码")).start();
    loading.spinner = spinner_style.arrow4;
    await newGit.checkout(selected, env); //签出分支
    await newGit.pull();
    successLog("拉取成功");
  } catch (error) {
    errorLog(error);
    errorLog("拉取失败!");
    process.exit(); //退出流程
  }
  loading.stop();
}
async function build() {
  // 选择站点
  const site = await select("选择站点", siteList);
  const temp = site.env.split("/");
  const ext = temp[temp.length - 1]; //提取目标文件夹的名称
  global.gitPath = site.env;
  global.ext = ext;
  await download(); //初始化仓库
  await gitPull();
}
build();
