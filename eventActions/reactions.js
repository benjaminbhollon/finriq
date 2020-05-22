const reactions = require("../config.json").channelReacts;

class reactionCheckAction {
  static async checkIfCorrect(message) {
    console.log(reactions.length);
    for(var i = 0; i < reactions.length; i++) {
      var obj = reactions[i];
  
      console.log(obj.channel);
      console.log(obj.reaction);
    }
  }
}

module.exports = reactionCheckAction;