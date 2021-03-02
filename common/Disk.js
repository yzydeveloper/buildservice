const diskinfo = require("diskinfo");
const GetMaxDiskInfo = () => {
  return new Promise((resolve, reject) => {
    diskinfo.getDrives(function (err, aDrives) {
      let MaxDiskInfo = aDrives.reduce((prev, cur) => {
        return prev.available > cur.available ? prev : cur;
      });
      if (MaxDiskInfo) {
        resolve({ Code: 0, Data: MaxDiskInfo, Message: "success" });
      }
      if (err || !MaxDiskInfo) {
        reject({ Code: -1, Message: err });
      }
    });
  });
};
exports.GetMaxDiskInfo = GetMaxDiskInfo;
