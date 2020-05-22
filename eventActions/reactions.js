const reactions = require("../config.json").channelReacts;

class reactionCheckAction {
  static async checkIfCorrect(message) {
    console.log(reactions.length);
    for(var i = 0; i < reactions.length; i++) {
      var obj = reactions[i];
      try {
        if (message.channel.id === obj.channel) {
          message.react(message.guild.emojis.cache.find(emoji => emoji.name === obj.react));
        }
      } catch (err) {
        console.log("Error with reaction." + err);
      }
    }
  }
}

module.exports = reactionCheckAction;