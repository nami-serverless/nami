const { asyncDescribeSubnets } = require('./../aws/awsFunctions');

module.exports = async function describeSubnets(defaultVpcID) {
  const describeSubnetParams = {
    Filters: [
       {
      Name: "vpc-id",
      Values: [
         defaultVpcID
      ]
     }
    ]
  };

  let subnetIds = [];
  const vpcSubnet = await asyncDescribeSubnets(describeSubnetParams);
  vpcSubnet.Subnets.forEach(function(subnetInfo) {
    subnetIds.push(subnetInfo.SubnetId);
  });

  return subnetIds.slice(0,2);
}
