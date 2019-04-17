const { asyncDeleteSecurityGroup } = require('./awsFunctions');

module.exports = async function deleteSecurityGroup(securityGroupName) {
  const deleteSecurityGroupParams = {
    GroupName: securityGroupName,
  };

  try {
    await asyncDeleteSecurityGroup(deleteSecurityGroupParams);
    console.log(`Security group ${securityGroupName} deleted`);
  } catch (e) {
    console.log(e.message);
  }
};
