const sleep = require('../util/sleep');

const {
  asyncDeleteSecurityGroup,
  asyncDescribeSecurityGroups,
} = require('./awsFunctions');


module.exports = async function deleteSecurityGroup(securityGroupName) {
  const deleteSecurityGroupParams = {
    GroupName: securityGroupName,
  };

  let securityGroups;
  let group = true;

  try {
    await asyncDeleteSecurityGroup(deleteSecurityGroupParams);
    while (group && securityGroupName.match(/EC2/)) {
      securityGroups = await asyncDescribeSecurityGroups();
      group = securityGroups.SecurityGroups.find(securityGroup => (
        securityGroup.GroupName === securityGroupName
      ));
      await sleep(2000);
    }
  } catch (err) {
    return err.message;
  }
  return true;
};
