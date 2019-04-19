const { asyncDescribeVpcs } = require('../aws/awsFunctions');

module.exports = async function getDefaultVpcId() {
  const allVpcData = await asyncDescribeVpcs({});
  const defaultVpcID = allVpcData.Vpcs.find(vpc => (vpc.IsDefault === true)).VpcId;

  return defaultVpcID;
};
