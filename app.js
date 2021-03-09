const { download, gitPull, install, compileDist } = require("./utils/build");
const { select, uploadBySSH, runCommand } = require("./utils/command");
const pinyin = require("pinyin");
const Git = require("./utils/git");
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
async function releaseBuild() {
  // 选择站点
  const site = await select("选择站点", siteList);
  const temp = site.env.split("/");
  const ext = temp[temp.length - 1]; //提取目标文件夹的名称
  global.gitPath = site.env;
  global.ext = ext;
  await download(); //初始化仓库
  await gitPull(); //拉代码
  await install(global.tar); //下载依赖
  await compileDist(global.tar); //打包
  let branch = new Git().curBranchInfo.name.split("/").reverse()[0];
  branch = pinyin(branch, {
    style: pinyin.STYLE_INITIALS,
  }).join(""); //将分支名转为拼音风格
  await uploadBySSH(branch); //执行上传操作
}
releaseBuild();
