const { Clone, Repository } = require("nodegit");

const initBranchPage = (projectName) => {
  let repository;
  let data = {};
  Repository.open(projectName)
    .then((repo) => {
      repository = repo;
      data.repo = repo;
      return repository.getCurrentBranch(repo);
    })
    .then((branch) => {
      // data.currentBranch = branch.toString();
      data.currentBranch = branch;
      return repository.getReferences();
    })
    .then((arrayReference) => {
      data.branches = arrayReference.filter((reference) => {
        return (
          reference.name().indexOf("refs/heads") !== -1 ||
          reference.name().indexOf("refs/remotes") !== -1
        );
      });
      let localBranches = getLocalBranches(data.branches);
      let remoteBranches = getRemoteBranches(data.branches);
      let origins = getOrigins(remoteBranches);
      let defaultBranch = getSelectedDefaultBranch(
        localBranches,
        data.currentBranch && data.currentBranch.name()
      );
      let defaultOrigin = getSelectedDefaultOrigin(
        origins,
        data.currentOrigin && data.currentOrigin.name()
      );
    });
};
initBranchPage("F:/build/gitroot/test.git/.git");
/**
 * 克隆
 * @param {*} url
 * @param {*} local_path
 */
const clone = (url, local_path) => {
  return new Promise((resolve, reject) => {
    Clone(url, local_path)
      .then((repository) => {
        resolve({ code: 0, message: "下载成功" });
      })
      .catch((error) => {
        reject("下载失败");
      });
  });
};
/**
 * 拉代码
 * @param {*} repo
 * @param {*} origin
 * @param {*} branch
 */
const pull = (repo, origin, branch) => {
  return repo.fetch(origin).then(() => {
    return repo.mergeBranches(branch, `${origin}/${branch}`);
  });
};
/**
 * 获取选定的默认原点
 * @param {*} origins
 * @param {*} origin
 */
const getSelectedDefaultOrigin = (origins = [], origin = "origin") => {
  let result = {};
  for (let obj of origins) {
    if (origin.indexOf(obj.origin) != -1) {
      result = obj;
    }
  }
  return result;
};
/**
 * 获取选定的默认分支
 * @param {*} branches
 * @param {*} branch
 */
const getSelectedDefaultBranch = (branches = [], branch = "master") => {
  let result = {};
  for (let obj of branches) {
    if (obj.fullName.indexOf(branch) != -1) {
      result = obj;
    }
  }
  return result;
};
/**
 * 获取远程分支列表
 * @param {*} branches
 */
const getRemoteBranches = (branches = []) => {
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
};
/**
 * 获取本地分支列表
 * @param {*} branches
 */
const getLocalBranches = (branches = []) => {
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
};
/**
 * 获取来源
 * @param {*} remoteBranches
 */
const getOrigins = (remoteBranches = []) => {
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
};
module.exports = {
  clone,
  getSelectedDefaultOrigin,
  getSelectedDefaultBranch,
  getRemoteBranches,
  getLocalBranches,
  pull,
};
