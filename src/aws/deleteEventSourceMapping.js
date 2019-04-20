const { asyncDeleteEventSourceMapping } = require('./awsFunctions');
const getUUID = require('../util/getUUID');

module.exports = async function deleteEventSourceMapping(resourceName) {
  const UUID = await getUUID(resourceName);

  try {
    if (UUID) {
      const deleteEventSourceMappingParams = {
        UUID,
      };

      await asyncDeleteEventSourceMapping(deleteEventSourceMappingParams);
    }
  } catch (err) {
    return err.message;
  }
  return true;
};
