## 安装
```JavaScript
### 克隆项目
git clone https://github.com/yzydeveloper/buildservice.git

### 进入项目目录
cd buildservice

### 安装依赖
npm install

### 配置config>index.js
### node app.js
```
在网上看到很多进行自动化构建的方案，例如Jenkins、GitLab CI。这种方法也有不好的地方，它需要在服务器上进行编译打包，占用服务器资源，且拓展性较低，这样还是颇为不便的。于是作者根据自身项目的需求，研究了一套拓展性自认为较高的CI工具。
## 一、整体思路
我们需要实现一个工具，当用户在终端输入构建命令时，执行如下步骤
1. 选择站点 例：A项目、B项目
2. 将项目从远端clone到本地(获取本地最大磁盘空间,创建/buildservice/gitroot/A项目.git,)
3. 选择要发布的分支 例:bugA分支
4. 执行shell命令 例:Vue项目 下载依赖-npm install 打包-npm run build (根据项目而定)
5. 使用ssh工具登录远程服务器
6. 将选择的bugA分转为拼音风格作为二级域名,将Nginx泛解析的匹配域名绑定到子目录配置
> `实现效果为 bugA.cloudrd.cn 访问bugA分支、bugB.cloudrd.cn 访问bugB分支`
7. 断开远程服务器
## 二、技术栈 
- [GitHub地址](https://github.com/yzydeveloper/buildservice/)
- `nodegit` 使用git提供的API。
- `node-ssh` 使用ssh登录远程服务器。
- `shelljs` 重新包装了child_process子进程模块，调用系统命令更方便。
- `diskinfo` 磁盘信息工具。
- `pinyin` 转换中文字符为拼音。
- `inquirer` 命令行交互功能。
- `chalk` 美化命令行，进行着色等。
- `ora` 命令行环境的 loading 效果。
## 三、工具相关
```
├─config
|   └index.js -----ssh配置、站点配置
├─utils
|   ├─build.js -----初始化站点目录、下载依赖、打包等方法
|   ├─command.js -----有关一些命令行操作的方法
|   ├─disk.js -----磁盘信息
|   ├─git.js  -----基于nodegit封装的Git类
|   ├─log.js  -----logs
|   ├─node_app.js -----基于nodefs模块封装的方法
|   └spinner_style.js 加载动画样式
├─app.js 程序入口
├─index.html
├─package-lock.json
├─package.json
├─README.md
```
## 四、图解大致流程
![第一步-选择发布站点](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/557d86ddb9c14786b435d576bdc7d5c8~tplv-k3u1fbpfcp-watermark.image)

![第二步-选择要发布的分支名称](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/456c7f2af403464792bffb77235244b3~tplv-k3u1fbpfcp-watermark.image)

![第三步-切分支、拉代码、下载依赖、打包、上传](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1317415ea6ef4c7e80dfc2c946a12199~tplv-k3u1fbpfcp-watermark.image)
## 五、如何进行项目配置
>其实很简单的，只需要配置一些ssh地址、用户名、密码、您的项目地址以及安装依赖以及打包的命令就可以啦
```JavaScript
// config>index.js
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
```
## 六、在项目根目录执行node app.js就可以进行站点发布啦
>~具体图解看步骤四噢
## 七、总结
此工具的好处就是各位可以开箱即用，无需在您的项目中配置乱七八蕉，只需动动小手将您的项目地址配置一下,就可以进行部署啦,拓展性还是比较高的，比如可以实现的Devops,当然实际运用时可以根据您们的思路以及相应的需求进行一定的扩展。

目前此工具我觉的是应该只能配合类Linux服务器使用,使用node-ssh与linux进行交互实现,如果想在windows服务器部署的话可能得使用MSDeploy+IIS来实现此功能。

如果您觉得对您有一点点帮助 点个赞或者去GitHub点个star 那就非常感谢了 [GitHub地址](https://github.com/yzydeveloper/buildservice/)
