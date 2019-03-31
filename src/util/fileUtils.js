const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);


const exists = async path => (
  new Promise((res) => {
    fs.stat(path, (err) => {
      if (err === null) res(true);
      res(false);
    });
  })
);

const createDirectory = async (name, path) => {
  const dir = `${path}/${name}`;

  const dirExists = await exists(dir);
  if (!dirExists) {
    await mkdir(dir);
  }
};

const createJSONFile = async (fileName, path, json) => {
	const configStr = JSON.stringify(json, null, 2);
  await writeFile(`${path}/${fileName}.json`, configStr);
};

const getNamiPath =  (path) => (`${path}/.nami`);

const readConfig = async (path) => {
  const namiPath = getNamiPath(path);
  const config = await readFile(`${namiPath}/config.json`);
  return JSON.parse(config);
};

module.exports = {
  readConfig,
	createDirectory,
  createJSONFile,
  getNamiPath,
  exists,
};
