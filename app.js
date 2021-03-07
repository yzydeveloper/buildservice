const { download } = require("./common/build");
const { select } = require("./common/command");
const { Repository } = require("nodegit");
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
async function build() {
  // 选择站点
  const site = await select("选择站点", siteList);
  const temp = site.env.split("/");
  const ext = temp[temp.length - 1]; //提取目标文件夹的名称
  global.gitPath = site.env;
  global.ext = ext;
  // 下载文件
  await download();
  const repository = await Repository.open(global.tar); //获取存储库
  const newGit = new Git(global.tar, repository); //实例化git
  let branchs = await newGit.getReferences(); //获取分支的实例信息
}
build();
