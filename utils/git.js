const { Clone, Repository, Reference, Branch } = require('nodegit')

class Git {
    constructor(target) {
        if (!Git.instance) {
            // 将 this 挂载到 Git 这个类的 instance 属性上实现单例模式
            this.target = target // 项目.git路径
            Git.instance = this
        }
        return Git.instance
    }

    /**
 * 初始化
 */
    init() {
        return new Promise(async (resolve, reject) => {
            try {
                this.repository = await Repository.open(global.tar) // 获取存储库
                this.branchs = await this.getReferences() // 获取分支的实例信息
                this.currentBranch = await this.getCurrentBranch()
                this.remoteBranches = this.getRemoteBranches() // 获取远程分支的信息
                this.localBranches = this.getLocalBranches() // 获取远程分支的信息
                this.origins = this.getOrigins(this.remoteBranches) // 获取所有分支的来源信息
                this.curBranchInfo = this.getBranchInfo(
                    this.remoteBranches,
                    this.currentBranch.name().split('/').reverse()[0]
                ) // 获取当前分支的信息
                this.curOriginInfo = await this.getCurrentOrigin() // 获取当前分支的来源信息
                resolve('初始化成功')
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
 * 签出分支
 * @param {*} branchName 分支名
 * @param {*} branchFullName 分支全名/origin/xxx
 */
    checkout(branchName, branchFullName) {
        // 如果本地分支有所选的分支则直接切换、无则迁出远程分支
        return new Promise(async (resolve, reject) => {
            try {
                const flag = this.localBranches.some((item) => item.name === branchName)
                if (flag) {
                    await this.checkoutBranch(branchName)
                } else {
                    await this.checkoutRemoteBranch(
                        branchName,
                        branchFullName.replace(/refs\/remotes\//, '')
                    ) // 切换分支
                }
                this.currentBranch = await this.getCurrentBranch()
                this.curBranchInfo = this.getBranchInfo(
                    this.remoteBranches,
                    this.currentBranch.name().split('/').reverse()[0]
                ) // 获取当前分支的信息
                this.curOriginInfo = await this.getCurrentOrigin() // 获取当前分支的来源信息
                // 获取当前分支的来源信息
                resolve('签出成功')
            } catch (error) {
                reject('签出失败')
            }
        })
    }

    /**
 * 拉取当前分支代码
 * @param {*} origin 当前分支的信息
 * @param {*} branch 当前分支的原点信息
 * @returns
 */
    pull() {
        // ==
        const branch = this.curBranchInfo.name.split('/').reverse()[0]
        const { origin } = this.getOriginInfo(
            this.origins,
            this.curOriginInfo && this.curOriginInfo.name()
        )
        return this.repository.fetch(origin).then(() => this.repository.mergeBranches(branch, `${origin}/${branch}`))
    }

    /**
 * 切分支
 * @param {*} branchName
 * @returns
 */
    checkoutBranch(branchName) {
        return this.repository.checkoutBranch(branchName)
    }

    /**
 * 切分支
 * @param {*} branchName
 * @param {*} branchFullName
 * @returns
 */
    checkoutRemoteBranch(branchName, branchFullName) {
        const create = (name, fullName, sha, upstreamName) => {
            let reference
            return Reference.create(this.repository, fullName, sha, 0, '')
                .then((ref) => {
                    reference = ref
                    return Branch.setUpstream(reference, upstreamName)
                })
                .then(() => this.repository.checkoutBranch(name))
        }
        return this.repository.getReference(branchFullName).then((reference) => create(
            branchName,
            `refs/heads/${branchName}`,
            reference.target().tostrS(),
            branchFullName
        ))
    }

    /**
 * 获取默认分支
 * @returns
 */
    getCurrentBranch() {
        return this.repository.getCurrentBranch(this.repository)
    }

    /**
 * 获取默认分支的来源信息
 * @returns
 */
    getCurrentOrigin() {
        return Branch.upstream(this.currentBranch)
    }

    /**
 * 获取所有分支的实例
 * @returns
 */
    getReferences() {
        return new Promise((resolve, reject) => {
            this.repository.getReferences().then((arrayReference) => {
                const branches = arrayReference.filter((reference) => (
                    reference.name().indexOf('refs/heads') !== -1
                    || reference.name().indexOf('refs/remotes') !== -1
                ))
                resolve(branches)
            })
        })
    }

    /**
 * 获取指定分支信息
 * @param {*} branches
 * @param {*} branch
 */
    getBranchInfo(branches = [], branch = 'master') {
        let result = {}
        for (const obj of branches) {
            if (obj.fullName.indexOf(branch) != -1) {
                result = obj
            }
        }
        return result
    }

    /**
 * 获取远程分支列表
 * @param {*} branches
 */
    getRemoteBranches(branches = this.branchs) {
        let remoteBranches = branches.filter((branch) => branch.name().indexOf('refs/remotes') != -1)
        remoteBranches = remoteBranches.map((branch) => ({
            name: branch.name().replace(/refs\/remotes\//g, ''),
            path: branch.name(),
            isHead: branch.isHead(),
            fullName: branch.name(),
        }))
        return remoteBranches
    }

    /**
 * 获取本地分支列表
 * @param {*} branches
 */
    getLocalBranches(branches = this.branchs) {
        let localBranches = branches.filter((branch) => branch.name().indexOf('refs/heads') != -1)
        localBranches = localBranches.map((branch) => ({
            name: branch.name().replace(/refs\/heads\//g, ''),
            path: branch.name(),
            isHead: branch.isHead(),
            fullName: branch.name(),
        }))
        return localBranches
    }

    /**
 * 获取指定原点的信息
 * @param {*} origins
 * @param {*} origin
 */
    getOriginInfo(origins = [], origin = 'origin') {
        let result = {}
        for (const obj of origins) {
            if (origin.indexOf(obj.origin) != -1) {
                result = obj
            }
        }
        return result
    }

    /**
 * 获取所有的来源信息
 * @param {*} remoteBranches
 */
    getOrigins(remoteBranches = []) {
        const origins = []
        remoteBranches.map((branch) => {
            const remoteOrigin = branch.path.split('/')[2]
            const exist = (origins, origin) => {
                let flag = false
                origins.map((value) => {
                    if (value.origin === origin) {
                        flag = true
                    }
                })
                return flag
            }
            if (!exist(origins, remoteOrigin)) {
                origins.push({
                    origin: remoteOrigin,
                    branches: [branch],
                })
            } else {
                origins.map((origin) => {
                    const remoteOrigin = branch.path.split('/')[2]
                    if (remoteOrigin === origin.origin) {
                        origin.branches.push(branch)
                    }
                })
            }
        })
        return origins
    }

    /**
 * 克隆
 * @param {*} url
 * @param {*} local_path
 */
    static clone(url, local_path) {
        return new Promise((resolve, reject) => {
            Clone(url, local_path)
                .then((repository) => {
                    resolve({ code: 0, message: '下载成功' })
                })
                .catch((error) => {
                    reject('下载失败')
                })
        })
    }
}
module.exports = Git
