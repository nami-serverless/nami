const { readConfig, readFile } = require('../util/fileUtils');

const {
  doesRoleExist,
  doesPolicyExist,
  isPolicyAttached,
} = require('./doesResourceExist');

const {
  asyncCreatePolicy,
  asyncCreateRole,
  asyncAttachPolicy,
} = require('./awsFunctions');


// prelambda and postlambda
const AWSLambdaBasicExecutionRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole';
const AWSLambdaRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole';

// postlambda
const AWSLambdaVPCAccessExecutionRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole';
const AWSLambdaSQSQueueExecutionRole = 'arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole';

// sqs

const rolePolicyLambda = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        Service: 'lambda.amazonaws.com',
      },
      Action: 'sts:AssumeRole',
    },
  ],
};

const getAttachParams = (roleName, policyArn) => (
  {
    RoleName: roleName,
    PolicyArn: policyArn,
  }
);

const getRoleParams = roleName => (
  {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify(rolePolicyLambda),
  }
);

// roleName === namiRole
const createRole = async (roleName) => {
  const roleParams = getRoleParams(roleName);
  //const doesRoleNameExist = await doesRoleExist(roleName);
  const doesRoleNameExist = false;
  if (!doesRoleNameExist) {
    // create nami Role in IAM
    await asyncCreateRole(roleParams);
  }
};

// create Role ->
// roleParams: rolename, policydocument ({ custom json object })
//

const attachPolicy = async (roleName, policyArn) => {
  //const isAwsPolicyAttached = await isPolicyAttached(roleName, policyArn);
  const isAwsPolicyAttached = false;
  if (!isAwsPolicyAttached) {
    const attachedParams = getAttachParams(roleName, policyArn);
    await asyncAttachPolicy(attachedParams);
  }
};

const createPreLambdaRole = async() => {
  let name = 'namiPreLambda';
  try
  {
    await createRole(name);
    await attachPolicy(name, AWSLambdaBasicExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaRolePolicyARN);
  } catch (err) {
    console.log(err);
  }
};

const createPostLambdaRole = async() => {
  let name = 'namiPostLambda';
  try {
    await createRole(name);
    await attachPolicy(name, AWSLambdaBasicExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaRolePolicyARN);
    await attachPolicy(name, AWSLambdaVPCAccessExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaSQSQueueExecutionRole);
  } catch (err) {
    console.log(err);
  }
};

//const createSQSRole = async(roleName) => {
//  await createRole('namiSQS');
//  await attachPolicy(roleName, );
//  await attachPolicy(roleName, );

//}

module.exports = {
  createPreLambdaRole,
  createPostLambdaRole,
};
