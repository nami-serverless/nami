const { readResources } = require('./../util/fileUtils');

const { 
  asyncGetRole, 
  asyncGetPolicy, 
  asyncGetResources, 
  asyncGetFunction 
} = require('./awsFunctions');

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
    return false;
  }
};

const doesLambdaExist = async (FunctionName) => {
  try {
    await asyncGetFunction({ FunctionName });
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  doesRoleExist,
  doesPolicyExist,
  doesAPIResourceExist,
  doesLambdaExist,
};
