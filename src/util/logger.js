const { log } = console;

const waveEmoji = '🌊';

module.exports = function namiLog(text) {
  log(waveEmoji.concat(` ${text}`));
};
