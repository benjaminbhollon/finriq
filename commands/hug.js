module.exports.execute = async (client, message, args) => {	try {
  message.delete();
  } catch(err) {
    console.log("Delete error" + err);
  }
  
  try {
    message.guild.channels.find(channel => channel.name == 'logs').send("Message by " + message.author.tag.replace(/@everyone/gi, "@.everyone") + " deleted in " + message.channel.replace(/@everyone/gi, "@.everyone") + ":\n\"" + message.content.replace(/@everyone/gi, "@.everyone") + "\"");
  }
  catch (err) {
    console.log(err);
  }
  if (parseInt(args[0])) {
    return await message.channel.send(`_Hugs <@${args[0]}>._\n_Don't worry, it'll be alright._`);
  } else {
    var name = args.join(" ");
    if (name == "") {
      return await message.channel.send(`_Hugs <@${message.author.id}>._\n_Don't worry, it'll be alright._`);
    }
    //Replace with mention if possible
    message.channel.members.forEach(member => {
      if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
    });
    if (name != "@everyone") {
      return await message.channel.send(`_Hugs ${name}._\n_Don't worry, it'll be alright._`);
    } else {
      return await message.channel.send("_Hugs the entire server._\n_Don't worry, it'll be alright._");
    }
  }
};

module.exports.config = {
  name: 'hug',
  aliases: ['hug'],
  module: "Fun",
  description: 'Hugs specified user.',
  usage: ['hug [user]']
};