const Discord = require('discord.js');
const logschannel = require('../config.json').channels.logs;

module.exports.execute = async (client, message, args) => {
  try {

    let logMessage = new Discord.RichEmbed()
				.setColor('#750384')
				.setTitle(`\`.hug\` command deleted`)
			logMessage.addField('User:', message.author.tag);
      logMessage.addField('Message:', message.content);
      logMessage.addField('Channel:', message.channel);
      
    message.delete();

			try {
				message.guild.channels.get(logschannel).send(logMessage);
			}
			catch(err) {
				console.log(err);
			}
  } catch(err) {
    console.log("Delete error" + err);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  if (getRandomInt(100) == 99) {
    if (parseInt(args[0])) {
      return await message.channel.send(`_<@${message.author.id}> shoots <@${args[0]}> violently._`);
    } else {
      var name = args.join(" ");
      //Replace with mention if possible
      message.channel.members.forEach(member => {
        if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
      });
      if (name != "@everyone") {
        return await message.channel.send(`_<@${message.author.id}> shoots ${name} violently._`);
      } else {
        return await message.channel.send(`_<@${message.author.id}> commits genocide._`);
      }
    }
  } else {
    return await message.channel.send(`Violence is never the answer, <@${message.author.id}>. Do... you need a \`.hug\`?`);
  }
};

module.exports.config = {
  name: 'shoot',
  aliases: ['gun', 'kill'],
  module: "Fun",
  description: 'Shoots specified user.',
  usage: ['shoot [user]']
};