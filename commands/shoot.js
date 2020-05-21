module.exports.execute = async (client, message, args) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  if (getRandomInt(100) == 99) {
    if (parseInt(args[0])) {
      return await message.channel.send("_Shoots <@" + args[0] + "> violently._");
    } else {
      function setName(input) {
        name = input;
      }
      var name = args.join(" ");
      //Replace with mention if possible
      message.channel.members.forEach(member => {
        if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
      });
      if (name != "@everyone") {
        return await message.channel.send("_Shoots <@" + name + "> violently._");
      } else {
        return await message.channel.send("_Genocide._");
      }
    }
  } else {
    return await message.channel.send("_Violence is never the answer. Do... you need a hug?_");
  }
};

module.exports.config = {
  name: 'shoot',
  aliases: ['gun'],
  description: 'Shoots *user*.',
  usage: ['shoot user']
};