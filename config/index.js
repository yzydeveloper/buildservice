module.exports = Object.freeze({
  SERVER_PATH: "", // ssh地址 服务器地址
  SSH_USER: "", // ssh 用户名
  PASSWORD: "", // 用密码连接服务器
  PATH: "/data/www", // 需要上传的服务器目录地址 如 /data/www/
  APPLICATION_PORTAL: "/buildservice/gitroot",
  SITE_DATA: [
    {
      name: "PC",
      value: "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/PC.git",
      install: "npm install",
      build: "npm run build",
    },
    {
      name: "H5",
      value: "http://admin:yxiBPPswzD3YpJS_aABJ@49.234.49.103:9090/root/h5.git",
      install: "npm install", //下载依赖
      build: "npm run build", //打包项目
    },
  ], //设置自己的站点信息
});
