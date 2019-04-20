const { log } = require('console');

module.exports = () => {
  log('Commands:');
  log('\tcreate [resourceName]\tcreates local lambda templates for modification');
  log('\tdeploy [resourceName]\tdeploys API endpoint and scalable architecture on AWS');
  log('\tdestroy [resourceName]\tdeletes API endpoint and scalable architecture from AWS');
  log('\tlist\t\t\tlists API endpoints for all resources');
};
