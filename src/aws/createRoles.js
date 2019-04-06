const { readConfig, readFile } = require('../util/fileUtils');
const { doesPolicyExist } = require('./doesResourceExist');
const {
  asyncCreatePolicy,
  asyncCreateRole,
  asyncAttachPolicy,
} = require('./awsFunctions');

const os = require('os');

// const {
//   doesRoleExist,
//   doesPolicyExist,
//   isPolicyAttached,
// } = require('./doesResourceExist');

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

const sendMessagePolicyParams = {
   "Version":"2012-10-17",
   "Statement":[
      {
         "Effect":"Allow",
         "Action":[
            "sqs:SendMessage",
            "sqs:SendMessageBatch",
         ],
         "Resource":"arn:aws:sqs:::*"
      },
   ]
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
  await asyncCreateRole(roleParams);
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

const createSQSSendMessageRolePolicy = async (SQSPolicyName, SQSPolicyArn) => {
  const doesSQSPolicyExist = await doesPolicyExist(SQSPolicyArn);

  if (!doesSQSPolicyExist) {
    const policyDocument = JSON.stringify(sendMessagePolicyParams);

    const policyParams = {
      PolicyName: SQSPolicyName,
      PolicyDocument: policyDocument,
    };

    await asyncCreatePolicy(policyParams);
  }
};

const createPreLambdaRole = async(name) => {
  const { accountNumber } = await readConfig(os.homedir);

  const SQSPolicyName = 'namiPreLambdaRoleSQSPolicy';
  const SQSPolicyArn = `arn:aws:iam::${accountNumber}:policy/${SQSPolicyName}`;

  try {
    await createRole(name);
    await createSQSSendMessageRolePolicy(SQSPolicyName, SQSPolicyArn);
    await attachPolicy(name, SQSPolicyArn);
    await attachPolicy(name, AWSLambdaBasicExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaRolePolicyARN);
  } catch (err) {
    console.log('Error creating PreLambdaRole => ', err.message);
  }
};

const createPostLambdaRole = async(name) => {
  try {
    await createRole(name);
    await attachPolicy(name, AWSLambdaBasicExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaRolePolicyARN);
    await attachPolicy(name, AWSLambdaVPCAccessExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaSQSQueueExecutionRole);
  } catch (err) {
    console.log('Error creating PostLambdaRole => ', err.message);
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
