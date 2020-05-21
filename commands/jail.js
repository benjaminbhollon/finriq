module.exports.execute = async (client, message, args) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  if (getRandomInt(100) == 99) {
    if (parseInt(args[0])) {
      return await message.channel.send(`_${args[0]} escapes!_`);
    } else {
      var name = args.join(" ");
      //Replace with mention if possible
      message.channel.members.forEach(member => {
        if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
      });
      if (name != "@everyone") {
        return await message.channel.send(`_${name} escapes!_`);
      } else {
        return await message.channel.send("_Everyone ran away._");
      }
    }
  } else {
    if (parseInt(args[0])) {
      return await message.channel.send(`_Puts ${args[0]} in jail_`);
    } else {
      var name = args.join(" ");
      //Replace with mention if possible
      message.channel.members.forEach(member => {
        if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
      });
      if (name != "@everyone") {
        return await message.channel.send(`_Puts ${name} in jail._`);
      } else {
        return await message.channel.send("_Everyone's in jail now._");
      }
    }
  }
};

module.exports.config = {
  name: 'jail',
  aliases: ['lockup', 'lock'],
  description: 'Jails specified user.',
  usage: ['jail [user]']
};

function setName(name) {
  function setName(input) {
    name = input;
  }
  return name;
}