module.exports = Object.freeze({
  SERVER_PATH: "", // ssh地址 服务器地址
  SSH_USER: "", // ssh 用户名
  PASSWORD: "", // 用密码连接服务器
  PATH: "/data/www", // 需要上传的服务器目录地址 如 /data/www/
  APPLICATION_PORTAL: "/buildservice/gitroot",
  SITE_DATA: [
    {
      name: "buildservice1",
      value: "http://49.234.49.103:9090/root/buildservice1.git",
      install: "npm install",
      build: "npm run build",
    },
    {
      name: "buildservice2",
      value: "http://49.234.49.103:9090/root/buildservice2.git",
      install: "npm install", //下载依赖
      build: "npm run build", //打包项目
    },
  ], //设置自己的站点信息
});
