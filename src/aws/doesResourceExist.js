const { asyncGetRole } = require('./awsFunctions');

const doesRoleExist = async (roleName) => {
  try {
    await asyncGetRole({ RoleName: roleName });
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { doesRoleExist };