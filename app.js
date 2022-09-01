const pinyin = require('pinyin')
const { download, gitPull, install, compileDist } = require('./utils/build')
const { select, uploadBySSH } = require('./utils/command')
const Git = require('./utils/git')
const { SITE_DATA } = require('./config')

async function releaseBuild() {
    // 选择站点
    const { env } = await select('选择站点', SITE_DATA)
    const temp = env.split('/')
    global.SITE_INFO = SITE_DATA.find((data) => data.value === env) // 设置全局的站点信息
    const ext = temp[temp.length - 1] // 提取目标文件夹的名称
    global.gitPath = env // 设置全局的站点git地址
    global.ext = ext // 目录
    await download() // 初始化仓库
    await gitPull() // 拉代码
    await install(global.tar) // 下载依赖
    await compileDist(global.tar) // 打包
    let branch = new Git().curBranchInfo.name.split('/').reverse()[0]
    branch = pinyin(branch, {
        style: pinyin.STYLE_INITIALS,
    })
        .join('')
        .toLowerCase() // 将分支名转为拼音风格
    await uploadBySSH(branch) // 执行上传操作
}
releaseBuild()
