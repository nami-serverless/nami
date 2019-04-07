const { asyncCreateSecurityGroup } = require('./../aws/awsFunctions');

module.exports = async function createSecurityGroup(Description, GroupName, VpcId) {
  const createSecurityGroupParams = {
    Description,
    GroupName,
    VpcId,
  }

  const securityGroup = await asyncCreateSecurityGroup(createSecurityGroupParams);
  return securityGroup.GroupId;
}
