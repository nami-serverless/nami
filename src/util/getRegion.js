const os = require('os');
const { readFileSync } = require('fs');
const homedir = os.homedir();

const getRegionFromConfigStr = (configStr) => {
  const defaultProfile = configStr.split('[').find(el => el.match('default'));
  const regionLine = defaultProfile.split('\n').find(el => el.match('region'));
  const [, region] = regionLine.split('= ');
  return region;
};

const getRegion = () => {
  try {
    const configStr = readFileSync(`${homedir}/.aws/config`, 'utf8');
    return getRegionFromConfigStr(configStr);
  } catch (err) {
    return false;
  }
};


module.exports = {
  getRegion,
};
