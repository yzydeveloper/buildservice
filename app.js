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
  const branchs = await newGit.getReferences(); //获取分支的实例信息
  const remoteBranches = newGit.getRemoteBranches(branchs); //获取远程分支的信息
  const origins = newGit.getOrigins(remoteBranches); //获取所有的来源
  const selectBranches = remoteBranches.map((item) => {
    return {
      name: item.name.split("/").reverse()[0],
      value: item.fullName,
    };
  });
  const { env } = await select("选择分支名称", selectBranches); //选择分支
  // 此处写法可以简写..为了使用api没有简写
  await newGit.checkoutRemoteBranch(env.split("/").reverse()[0], env); //切换分支
  // const currentBranch = await newGit.getCurrentBranch(); //获取切换过来分支的信息
  // const defaultBranch = newGit.getBranchInfo(
  //   remoteBranches,
  //   currentBranch.name().split("/").reverse()[0]
  // );
  // let defaultOrigin = newGit.getOriginInfo(
  //   origins,
  //   currentBranch.name().split("/").reverse()[0]
  // );
  // console.log(currentBranch.name().split("/").reverse()[0])
  // console.log(origins);
  // console.log(defaultOrigin)
}
build();
