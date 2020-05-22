// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');
const Discord = require('discord.js');
const config = require('../config.json');

class afkMessageCheckAction {
	static async checkIfUserIsAFK(message) {
    var cooldown = false;
    function cooldownOn() {
      cooldown = true;
    }
    // If the cooldown is on, ignore the message
    Afks.findAll({where: {user:message.author.id}}).then(result => {
      if (Date.now() - result.timestamp < 300000) {
        cooldownOn();
      }
    });
		if (cooldown) {
			return;
		} else if (message.content.toLowerCase().indexOf("good") != -1 && message.content.toLowerCase().indexOf("morning") != -1 && message.content.toLowerCase().indexOf("bookery") != -1) {
      const sender = message.author;
      Afks.destroy({
        where: {
          user: sender.id
        }
      }).then(result => {
        // User successfully removed from table
        if (result == 1) {
          sender.send(`Welcome back, ${message.member.nickname ? message.member.nickname : message.author.username}!`);
          return;
        }
      });
    }
		const sender = message.author;
		const reactionFilter = (reaction, user) => {
			if ((reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id == sender.id) {
				if (reaction.emoji.name === '✅') {
					Afks.destroy({
						where: {
							user: sender.id
						}
					}).then(result => {
						// User successfully removed from table
						if (result == 1) {
							sender.send(`Welcome back, ${message.member.nickname ? message.member.nickname : message.author.username}!`);
							return;
						}
					});
				} else if (reaction.emoji.name === '❌') {
					return;
				} else {
					return;
				}
			}
		};
		const noLongerAFKMessage = new Discord.RichEmbed()
			.setTitle(`You are currently AFK, ${message.member.nickname ? message.member.nickname : message.author.username}`)
			.addField('Are you back?', 'Then react with ✅',true)
			.addField('If you are not back!', 'Then react with ❌',true)
			.setFooter('This message will delete itself after 15 seconds')
			.setColor('#750384');
		const user = message.author;

		await Afks.sync().then(() => {
			Afks.findAll({
				where: {
					user: user.id
				}
			}).then(result => {
				if (result.length == 1) {
					message.author.send(noLongerAFKMessage).then(msg => {
						msg.react('✅');
						msg.react('❌');
						// Use reaction filter to remove to remove the user from the database rather than an event
						let collector = msg.createReactionCollector(reactionFilter, { time: 15000 });
						collector.on('end', () => {
							msg.delete().catch(() => console.log('Tried deleting afk message that was already deleted'));
						});
					});
				}
			});
		});
	}

	static async checkForMention(message) {
		// Make sure the message is meant for the one person only. This also means the bot will not trigger on tag spams.
		if (message.mentions.members.size == 1) {
			let id = message.mentions.members.firstKey();
			Afks.sync().then(() => {
				Afks.findAll({
					where: {
						user: id
					}
				}).then(result => {
					if (result.length == 1) {
						message.guild.fetchMember(result[0].user).then(user => {
							let name = user.nickname ? user.nickname : user.user.username;
							const embed = new Discord.RichEmbed()
								.setTitle(`${name} is not here`)
								.addField('AFK Message:',result[0].message)
								.setColor('#750384');
							message.channel.send(embed);
						});
					}
				});
			});
		}
	}
}

module.exports = afkMessageCheckAction;