module.exports = function isValidResourceName(resourceName) {
  const regex = /^[a-zA-Z0-9-_]{1,64}$/;
  return regex.test(resourceName);
};
