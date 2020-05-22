const status = require('../config.json').playing;

module.exports = async (client, message) => {
  bot.user.setGame(status);
};