const fs = require("fs");
/**
 * 判断给定的path是否是目录类型。否则递归创建
 * @param {*} path 路径
 */
const ExistsCatalog = function (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, function (failed, stats) {
      try {
        stats.isDirectory();
      } catch (err) {
        Mkdir(path);
      }
      resolve("初始化目录成功");
    });
  });
};
/**
 * 读取文件夹下是否有文件
 * @param {*} path
 */
const Readdir = function (path) {
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
const Mkdir = function (path) {
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
  ExistsCatalog,
  Readdir,
  Mkdir,
};
