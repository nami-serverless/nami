const sleep = require('./../util/sleep');

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
    while (group) {
      securityGroups = await asyncDescribeSecurityGroups();
      group = securityGroups.SecurityGroups.find((group) => {
        return (group.GroupName === securityGroupName);
      });
      await sleep(2000);
    }
    console.log(`Security group ${securityGroupName} deleted`);
  } catch (e) {
    console.log(e.message);
  }
};
