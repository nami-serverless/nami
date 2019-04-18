/**
 * @jest-environment node
 */

const os = require('os');
const axios = require('axios');
const deployApi = require('../src/aws/deployApi');
const deployPreLambda = require('../src/aws/deployPreLambda');
const deployDLQ = require('../src/aws/deployDLQ');
const deploySQS = require('../src/aws/deploySQS');
const { doesAPIResourceExist } = require('../src/aws/doesResourceExist');
const destroy = require('../src/commands/destroy');
const sleep = require('./../src/util/sleep');

const preLambdaName = 'testNami';
const homedir = os.homedir();
const stageName = 'nami';
const httpMethods = ['POST'];

describe('nami deploy api resource', () => {
  beforeEach(async () => {
    jest.setTimeout(120000);
  });

  afterEach(async () => {
    await destroy(preLambdaName, homedir);
  });

  test('Api resource exists on AWS', async () => {
    await deployPreLambda(preLambdaName, homedir);
    await deployApi(preLambdaName, homedir, httpMethods, stageName);
    const apiExists = await doesAPIResourceExist(preLambdaName, homedir);

    expect(apiExists).toBe(true);
  });

  test('Response is 200 when hitting endpoint', async () => {
    let response;
    await deployPreLambda(preLambdaName, homedir);
    const { endpoint } = await deployApi(preLambdaName, homedir, httpMethods, stageName);
    await sleep(65000);
    await deployDLQ(preLambdaName);
    await deploySQS(preLambdaName, homedir);

    try {
      response = await axios.post(endpoint);
    } catch (err) {
      console.log(err);
    }
    console.log(response);
    expect(response.status).toBe(200);
  });
});
