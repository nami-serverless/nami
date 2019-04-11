const {
  asyncCreateRole,
  asyncAttachPolicy,
} = require('./awsFunctions');

// prelambda and postlambda shared roles
const AWSLambdaBasicExecutionRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole';
const AWSLambdaRolePolicyARN = 'arn:aws:iam::aws:policy/service-role/AWSLambdaRole';

// prelambda specific roles
const AWSLambdaSQSFullAccess = 'arn:aws:iam::aws:policy/AmazonSQSFullAccess';

// postlambda specific roles
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

const createRole = async (roleName, description) => {
  const roleParams = getRoleParams(roleName, description);
  await asyncCreateRole(roleParams);
};

const attachPolicy = async (roleName, policyArn) => {
  const attachedParams = getAttachParams(roleName, policyArn);
  await asyncAttachPolicy(attachedParams);
};

const createPreLambdaRole = async (name) => {
  const description = 'Permissions for a Lambda function to return a HTTP response to a webhook, and send the webhook message to SQS';

  try {
    await createRole(name, description);
    await attachPolicy(name, AWSLambdaSQSFullAccess);
    await attachPolicy(name, AWSLambdaBasicExecutionRolePolicyARN);
    await attachPolicy(name, AWSLambdaRolePolicyARN);
  } catch (err) {
    console.log('Error creating PreLambdaRole => ', err.message);
  }
};

const createPostLambdaRole = async (name) => {
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

module.exports = {
  createPreLambdaRole,
  createPostLambdaRole,
};
