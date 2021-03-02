const Git = require("nodegit");
module.exports = {
  /**
   * 克隆
   * @param {*} url
   * @param {*} local_path
   */
  Clone: function (url, local_path) {
    return new Promise((resolve, reject) => {
      Git.Clone(url, local_path)
        .then((repository) => {
          resolve({ Code: 0, Message: "下载成功" });
        })
        .catch((error) => {
          reject("下载失败");
        });
    });
  },
};
