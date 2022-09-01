const diskinfo = require('diskinfo')

const getMaxDiskInfo = () => new Promise((resolve, reject) => {
    diskinfo.getDrives((err, aDrives) => {
        const maxDiskInfo = aDrives.reduce((prev, cur) => (prev.available > cur.available ? prev : cur))
        if (maxDiskInfo) {
            resolve({ code: 0, data: maxDiskInfo, message: 'success' })
        }
        if (err || !maxDiskInfo) {
            reject(new Error({ code: -1, message: err }))
        }
    })
})
exports.getMaxDiskInfo = getMaxDiskInfo
