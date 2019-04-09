const { asyncDeleteSecurityGroup } = require('./awsFunctions');

module.exports = async function deleteSecurityGroup(securityGroupName) {
  const deleteSecurityGroupParams = {
    GroupName: securityGroupName,
  };

  await asyncDeleteSecurityGroup(deleteSecurityGroupParams);
};
