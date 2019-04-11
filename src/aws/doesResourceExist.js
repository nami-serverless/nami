const { readResources } = require('./../util/fileUtils');
const { asyncGetResources } = require('./awsFunctions');

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

const doesAPIResourceExist = async (resourceName, homedir) => {
  try {
    const { restApiId } = await readResources(homedir);
    const apiGetResourcesParams = { restApiId };
    const resources = await asyncGetResources(apiGetResourcesParams);

    return !!(resources.items.find(item => item.pathPart === `${resourceName}`));
  } catch (err) {
    console.log(`${err.message}`);
  }
};

module.exports = {
  doesRoleExist,
  doesPolicyExist,
  doesAPIResourceExist,
};
