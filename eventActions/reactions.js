const reactions = require("../config.json").channelReacts;

class reactionCheckAction {
  static async checkIfCorrect(message) {
    reactions.forEach((id) => {
      console.log(reactions[id]);
      /*if (message.channel.id == reactions[id]) {
        message.react();
      }*/
    });
  }
}

module.exports = reactionCheckAction;