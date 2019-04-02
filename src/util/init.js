const setupNamiDirAndFiles = require('./setupNamiDirAndFiles');

module.exports = async function init(roleName, path) {
  await setupNamiDirAndFiles(roleName, path);
  return true;
};
