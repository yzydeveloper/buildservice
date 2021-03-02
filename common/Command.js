/**
 *
 * @param {String} command 命令操作 如 ls
 */
const RunCommand = async (command) => {
  const result = await ssh.exec(command, [], { cwd: "/data/www" });
};
module.exports = {
  RunCommand,
};
