const { initDir, download } = require("./common/build");
const gitPath =
  "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/test.git"; //远端git地址
//   "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/test.git";
const temp = gitPath.split("/");
const ext = temp[temp.length - 1]; //提取目标文件夹的名称
global.gitPath = gitPath;
global.ext = ext;
async function run() {
  await download();
}
run();
