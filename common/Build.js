const Ora = require("ora"); // 加载流程动画
const SpinnerStyle = require("./SpinnerStyle"); //加载动画样式
const { NodeSSH } = require("node-ssh");
const PinYin = require("pinyin");
const { DefaultLog, ErrorLog, SuccessLog } = require("./Log"); //Logs
const { GetMaxDiskInfo } = require("./Disk"); //获取磁盘信息
const { ExistsCatalog, Readdir } = require("./NodeApplication");
const { Clone } = require("./Git");
const GitPath = "https://github.com/bgwd666/deploy.git"; //远端git地址
//   "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/test.git";
const Temp = GitPath.split("/");
const Ext = Temp[Temp.length - 1]; //提取目标文件夹的名称
const CloneLine = async () => {
  const { Code, Data } = await GetMaxDiskInfo(); //获取磁盘信息
  if (Code === 0) {
    DefaultLog("正在初始化目录");
    const Tar = `${Data.mounted}/buildservice/gitroot/${Ext}`;
    // 创建目标文件夹
    await ExistsCatalog(Tar);
    // 获取目标文件夹中是否有文件
    const File = await Readdir(Tar);
    const Loading = Ora(DefaultLog("正在下载文件")).start();
    try {
      // 无文件则拉代码
      if (!File.length) {
        await Clone(GitPath, Tar);
      } else {
        // 有则切分支或拉代码
      }
      SuccessLog("下载成功");
    } catch (error) {
      ErrorLog(error);
    }
    Loading.stop();
  }
};
CloneLine();
// console.log(
//   PinYin("0122yzy功能模块", {
//     style: PinYin.STYLE_INITIALS, // 设置拼音风格
//   })
// );
// const ssh = new NodeSSH();
// //连接服务器
// const connectSSH = async () => {
//   const loading = Ora(DefaultLog("正在连接服务器")).start();
//   loading.spinner = SpinnerStyle.arrow4;
//   try {
//     await ssh.connect({
//       host: "",
//       username: "",
//       password: "",
//     });
//     SuccessLog("SSH连接成功!");
//   } catch (error) {
//     ErrorLog(error);
//     ErrorLog("SSH连接失败!");
//     process.exit(); //退出流程
//   }
//   loading.stop();
// };
