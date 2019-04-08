const os = require('os');

const { readConfig } = require('../util/fileUtils');
const { doesPolicyExist } = require('./doesResourceExist');
const {
  asyncCreatePolicy,
  asyncCreateRole,
  asyncAttachPolicy,
} = require('./awsFunctions');

// const {
//   doesRoleExist,
//   doesPolicyExist,
//   isPolicyAttached,
// } = require('./doesResourceExist');

// prelambda and postlambda
const AWSLambdaBasicExecutionRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole';
const AWSLambdaRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole';

// prelambda
const AWSLambdaSQSFullAccess = 'arn:aws:iam::aws:policy/AmazonSQSFullAccess';

// postlambda
const AWSLambdaVPCAccessExecutionRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole';
const AWSLambdaSQSQueueExecutionRole = 'arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole';


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

// const sendMessagePolicyParams = {
//   Version: '2012-10-17',
//   Statement: [
//     {
//       Effect: 'Allow',
//       Action: [
//         'sqs:SendMessage',
//         'sqs:SendMessageBatch',
//       ],
//       Resource: 'arn:aws:sqs:::*',
//     },
//   ],
// };

const getAttachParams = (roleName, policyArn) => (
  {
    RoleName: roleName,
    PolicyArn: policyArn,
  }
);

const getRoleParams = (roleName, description) => (
  {
    RoleName: roleName,
    Description: description,
    AssumeRolePolicyDocument: JSON.stringify(rolePolicyLambda),
  }
);

// roleName === namiRole
const createRole = async (roleName, description) => {
  const roleParams = getRoleParams(roleName, description);
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
  const description = 'Permissions for a Lambda function to return a HTTP response to a webhook, and send the webhook message to SQS';

  try {
    await createRole(name, description);
    // await createSQSSendMessageRolePolicy(SQSPolicyName, SQSPolicyArn);
    // await attachPolicy(name, SQSPolicyArn);
    await attachPolicy(name, AWSLambdaSQSFullAccess);
    console.log('sqs full access');
    await attachPolicy(name, AWSLambdaBasicExecutionRolePolicyARN);
    console.log('basic exe..');
    await attachPolicy(name, AWSLambdaRolePolicyARN);
  } catch (err) {
    console.log('Error creating PreLambdaRole => ', err.message);
  }
};

const createPostLambdaRole = async(name) => {
  const description = 'Permissions for a Lambda function to take a webhook message from the queue and write it to a database on EC2';
  try {
    await createRole(name, description);
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
