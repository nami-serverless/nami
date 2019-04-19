const { readResources } = require('./../util/fileUtils');
const { asyncGetResources } = require('./../aws/awsFunctions');
const getRegion = require('./../util/getRegion');

const namiLog = require('./../util/logger');
const namiErr = require('./../util/errorLogger');

module.exports = async function list(homedir) {
  const noActiveEndpointError = 'You have no current active endpoints';

  try {
    const { restApiId } = await readResources(homedir);

    const getResourcesParams = {
      restApiId,
    };

    const namiApiGwResources = await asyncGetResources(getResourcesParams);

    let endpoint;
    const region = getRegion();

    if (namiApiGwResources.items.length === 0) {
      namiLog(noActiveEndpointError);
    } else {
      namiLog('Your resources are:');
      namiApiGwResources.items.forEach((item) => {
        if (item.pathPart !== undefined) {
          endpoint = `https://${restApiId}.execute-api.${region}.amazonaws.com/nami/${item.pathPart}`;
          namiLog(`${item.pathPart} : ${endpoint}`);
        }
      });
    }
  } catch (err) {
    namiErr(noActiveEndpointError);
  }
};
