const { Clone, Repository } = require("nodegit");
class Git {
  constructor(target, repository) {
    if (!Git.instance) {
      // 将 this 挂载到 Ble 这个类的 instance 属性上实现单例模式
      this.target = target; // 项目.git路径
      this.repository = repository; // 存储库
      Git.instance = this;
    }
    return Git.instance;
  }

  /**
   * 获取默认分支
   * @returns
   */
  getCurrentBranch() {
    return this.repository.getCurrentBranch(this.repository);
  }

  /**
   * 获取所有分支的实例
   * @returns
   */
  getReferences() {
    return new Promise((resolve, reject) => {
      this.repository.getReferences().then((arrayReference) => {
        const branches = arrayReference.filter((reference) => {
          return (
            reference.name().indexOf("refs/heads") !== -1 ||
            reference.name().indexOf("refs/remotes") !== -1
          );
        });
        resolve(branches);
      });
    });
  }
  /**
   * 获取分支信息
   * @param {*} branches
   * @param {*} branch
   */
  getBranchInfo(branches = [], branch = "master") {
    let result = {};
    for (let obj of branches) {
      if (obj.fullName.indexOf(branch) != -1) {
        result = obj;
      }
    }
    return result;
  }
  /**
   * 获取远程分支列表
   * @param {*} branches
   */
  getRemoteBranches(branches = []) {
    let remoteBranches = branches.filter((branch) => {
      return branch.name().indexOf("refs/remotes") != -1;
    });
    remoteBranches = remoteBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/remotes\//g, ""),
        path: branch.name(),
        isHead: branch.isHead(),
        fullName: branch.name(),
      };
    });
    return remoteBranches;
  }
  /**
   * 获取本地分支列表
   * @param {*} branches
   */
  getLocalBranches(branches = []) {
    let localBranches = branches.filter((branch) => {
      return branch.name().indexOf("refs/heads") != -1;
    });
    localBranches = localBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/heads\//g, ""),
        path: branch.name(),
        isHead: branch.isHead(),
        fullName: branch.name(),
      };
    });
    return localBranches;
  }
  /**
   * 获取指定原点的信息
   * @param {*} origins
   * @param {*} origin
   */
  getOriginInfo(origins = [], origin = "origin") {
    let result = {};
    for (let obj of origins) {
      if (origin.indexOf(obj.origin) != -1) {
        result = obj;
      }
    }
    return result;
  }
  /**
   * 获取来源
   * @param {*} remoteBranches
   */
  getOrigins(remoteBranches = []) {
    let origins = [];
    remoteBranches.map((branch) => {
      let remoteOrigin = branch.path.split("/")[2];
      let exist = (origins, origin) => {
        let flag = false;
        origins.map((value) => {
          if (value.origin === origin) {
            flag = true;
          }
        });
        return flag;
      };
      if (!exist(origins, remoteOrigin)) {
        origins.push({
          origin: remoteOrigin,
          branches: [branch],
        });
      } else {
        origins.map((origin) => {
          let remoteOrigin = branch.path.split("/")[2];
          if (remoteOrigin === origin.origin) {
            origin.branches.push(branch);
          }
        });
      }
    });
    return origins;
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
          resolve({ code: 0, message: "下载成功" });
        })
        .catch((error) => {
          reject("下载失败");
        });
    });
  }
}
module.exports = Git;
