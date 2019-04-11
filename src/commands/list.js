const namiLog = require('./../util/logger');
const { readResources } = require('./../util/fileUtils');
const { asyncGetResources } = require('./../aws/awsFunctions');
const getRegion = require('./../util/getRegion');


module.exports = async function list(homedir) {
  // read rest API id from nami hidden folder
  // use getResources to retrieve all resources associated with the apigw endpoint
  // resource indicates available system / endpoint.
  const { restApiId } = await readResources(homedir);
  const getResourcesParams = {
    restApiId,
  };
  const namiApiGwResources = await asyncGetResources(getResourcesParams);
  let endpoint;
  const region = getRegion();

  if (namiApiGwResources.items.length === 0) {
    namiLog('You have no current active endpoints');
  } else {
    namiLog('Your resources are:');
    namiApiGwResources.items.forEach((item) => {
      if (item.pathPart !== undefined) {
        endpoint = `https://${restApiId}.execute-api.${region}.amazonaws.com/nami/${item.pathPart}`;
        namiLog(`${item.pathPart} : ${endpoint}`);
      }
    });
  }
};
