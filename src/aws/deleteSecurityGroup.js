const sleep = require('./../util/sleep');
const namiLog = require('../util/logger');
const namiErr = require('../util/errorLogger');

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
    namiLog(`Security group ${securityGroupName} deleted`);
  } catch (e) {
    namiErr(e.message);
  }
};
