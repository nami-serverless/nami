const { log } = require('console');

module.exports = () => {
  log('Commands:');
  log('\tcreate [resourceName]\tcreates local lambda templates for modification');
  log('\tdeploy [resourceName]\tdeploys API endpoint');
  log('\tdestroy [resourceName]\tdeletes API endpoint');
  log('\tlist\t\t\tlists API endpoints for all resources');
};
