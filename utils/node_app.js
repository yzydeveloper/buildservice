const fs = require("fs");
/**
 * 判断给定的path是否是目录存在
 * @param {*} path 路径
 */
const hasCatalog = function (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      resolve(err ? false : true);
    });
  });
};
/**
 * 读取文件夹下是否有文件
 * @param {*} path
 */
const readdir = function (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (!err) {
        resolve(files);
      } else {
        reject("读取失败");
      }
    });
  });
};
/**
 * 创建文件夹--递归创建
 * @param {*} path
 */
const mkdir = function (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(
      path,
      {
        recursive: true, //是否递归,默认false
      },
      (err) => {
        // 创建完成
        if (!err) {
          resolve("创建成功");
        } else {
          reject("创建失败");
        }
      }
    );
  });
};
module.exports = {
  hasCatalog,
  readdir,
  mkdir,
};
