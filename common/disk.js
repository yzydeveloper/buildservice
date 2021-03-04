const diskinfo = require("diskinfo");
const getMaxDiskInfo = () => {
  return new Promise((resolve, reject) => {
    diskinfo.getDrives(function (err, aDrives) {
      let maxDiskInfo = aDrives.reduce((prev, cur) => {
        return prev.available > cur.available ? prev : cur;
      });
      if (maxDiskInfo) {
        resolve({ code: 0, data: maxDiskInfo, message: "success" });
      }
      if (err || !maxDiskInfo) {
        reject({ code: -1, message: err });
      }
    });
  });
};
exports.getMaxDiskInfo = getMaxDiskInfo;
