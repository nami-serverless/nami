const { asyncListEventSourceMappings } = require('../aws/awsFunctions');

module.exports = async function getUUID(resourceName) {
  const FunctionName = `${resourceName}PostLambda`;
  let uuid;

  const listEventSourceMappingsParams = {
    FunctionName,
  };

  const eventSourceMappings = await asyncListEventSourceMappings(listEventSourceMappingsParams);

  if (eventSourceMappings.EventSourceMappings.length > 0) {
    uuid = eventSourceMappings.EventSourceMappings[0].UUID;
  }

  return uuid;
};
