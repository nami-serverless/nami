const { log } = console;

const errorEmoji = '⚠️ ';

module.exports = function namiErr(text) {
  log(errorEmoji.concat(` ${text}`));
};
