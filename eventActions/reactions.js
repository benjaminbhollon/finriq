const reactions = require("../config.json").channelReacts;

class reactionCheckAction {
  static async checkIfCorrect(message) {
    console.log(reactions.length);
    for(var i = 0; i < reactions.length; i++) {
      var obj = reactions[i];

      if (message.channel.id === obj.channel) {
        message.react(obj.react);
      }
    }
  }
}

module.exports = reactionCheckAction;