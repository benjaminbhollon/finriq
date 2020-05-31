const config = require('../config.json');

class tosActions {
	static userAcceptsTOS(reaction, user, client) {
    console.log("Hello world!");
		if (reaction.message.channel.id === config.channels.tos
            && reaction._emoji.name === config.emotes.acceptTOS) {
			reaction.message.guild.fetchMember(user.id).then(guildMember => {
        // Send welcome message to the welcome channel
        client.channels.get(config.channels.welcome).send(`🎉 **A new member has arrived!** 🎉\nWelcome to The Bookery <@${user.id}>!`)
          .then(message => {
            message.react(config.emotes.wave);
          });
				user.send(`**Welcome to The Bookery!** :blush:
To begin, say hello in <#382364344731828226> and read up in <#384040181763670026> for our step by step guide.
Lastly, to learn more visit us any time at: <https://knightsofacademia.org>.
**Ask me questions, tell me to do stuff.**
I am your all in one assistant, designed to help and cater to your needs. It's nice to meet you. 
Here are a few things you can ask me:
-!info [term]
-!raid
-!help
-!highlight
-!clans/!apply
-!invite [koa][koai][jesters]
-!choose [choice 1],[choice 2]`);
			});
		}
	}

}

module.exports = tosActions;