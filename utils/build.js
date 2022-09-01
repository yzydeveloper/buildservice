const ora = require('ora') // 加载流程动画
const shell = require('shelljs') // 执行shell命令
const spinner_style = require('./spinner_style') // 加载动画样式
const { defaultLog, errorLog, successLog } = require('./log') // Logs
const { getMaxDiskInfo } = require('./disk') // 获取磁盘信息
const { hasCatalog, readdir, mkdir } = require('./node_app')
const { select } = require('./command')
const { APPLICATION_PORTAL } = require('./../config')
const Git = require('./git')
/**
 * 初始化项目
 */
const download = async () => {
    let loading
    try {
        const { data } = await getMaxDiskInfo() // 获取磁盘信息
        const tar = `${data.mounted}${APPLICATION_PORTAL}/${global.ext}`
        // 设置全局的站点路径
        global.tar = tar
        // 是否存在这个目录
        const isExists = await hasCatalog(tar)
        if (!isExists) {
            await mkdir(tar)
        }
        // 获取目标文件夹中是否有文件
        const file = await readdir(tar)
        // 无文件则拉代码
        loading = ora(defaultLog('正在初始化站点')).start()
        loading.spinner = spinner_style.arrow4
        if (!file.length) {
            await Git.clone(global.gitPath, tar)
        } else {
            // 有则切分支或拉代码
        }
        successLog('初始化成功')
    } catch (error) {
        errorLog(error)
        process.exit() // 退出流程
    }
    if (loading) {
        loading.stop()
    }
}
/**
 *
 * @param {*} path 绝对路径
 */
const install = async (path) => {
    const loading = ora(defaultLog('下载依赖')).start()
    loading.spinner = spinner_style.arrow4
    shell.cd(path)
    const res = await shell.exec(global.SITE_INFO.install) // 执行shell 打包命令
    loading.stop()
    if (res.code === 0) {
        successLog('依赖下载完成!')
    } else {
        errorLog('依赖下载失败, 请重试!')
        process.exit() // 退出流程
    }
}
/**
 *
 * @param {*} path 绝对路径
 */
const compileDist = async (path) => {
    const loading = ora(defaultLog('项目开始打包')).start()
    loading.spinner = spinner_style.arrow4
    shell.cd(path)
    const res = await shell.exec(global.SITE_INFO.build) // 执行shell 打包命令
    loading.stop()
    if (res.code === 0) {
        successLog('项目打包成功!')
    } else {
        errorLog('项目打包失败, 请重试!')
        process.exit() // 退出流程
    }
}
/**
 * 拉代码流程
 */
const gitPull = async () => {
    let loading
    try {
        const newGit = new Git(global.tar) // 实例化git
        await newGit.init() // 初始化git
        const branchesList = newGit.remoteBranches.map((item) => ({
            name: item.name.split('/').reverse()[0],
            value: item.fullName,
        }))
        const { env } = await select('选择分支名称', branchesList) // 选择分支
        const selected = env.split('/').reverse()[0]
        loading = ora(defaultLog('正在拉取代码')).start()
        loading.spinner = spinner_style.arrow4
        await newGit.checkout(selected, env) // 签出分支
        await newGit.pull()
        successLog('拉取成功')
    } catch (error) {
        errorLog(error)
        errorLog('拉取失败!')
        process.exit() // 退出流程
    }
    if (loading) {
        loading.stop()
    }
}
module.exports = {
    download,
    compileDist,
    install,
    gitPull,
}
