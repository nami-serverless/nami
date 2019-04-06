const { asyncGetRole, asyncGetPolicy } = require('./awsFunctions');

const doesRoleExist = async (roleName) => {
  try {
    await asyncGetRole({ RoleName: roleName });
    return true;
  } catch (err) {
    return false;
  }
};

const doesPolicyExist = async (policyArn) => {
  try {
    await asyncGetPolicy({ PolicyArn: policyArn });
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  doesRoleExist,
  doesPolicyExist,
 };
