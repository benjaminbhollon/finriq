const config = require('../config.json');

class tosActions {
	static userAcceptsTOS(reaction, user, client) {
		if (reaction.message.channel.id === config.channels.tos && reaction._emoji.name === config.emotes.acceptTOS) {
			reaction.message.guild.fetchMember(user.id).then(guildMember => {
        // Send welcome message to the welcome channel
        client.channels.get(config.channels.welcome).send(`\`\`\`fix\nA new member has arrived!\`\`\`\n**Please welcome" ${user.id} "to the server, <@&693517619457818634>!**\n\n**Quick Start Guide**\n • You can grab some roles in <#693563108077076490>. Also feel free use the introduction template pinned in <#711269048591056916>.\n • To learn more about the server, check out <#693500724704837653>.\n • When you're ready, feel free to join the general chat in <#693498873083330654>.\n\n**More Info**\n📚 Want to read with us? We host multiple reading groups! To learn more about them, just ask! Or you can check them out in the rules and info channel. If you like this server, you can help us out by inviting your friends or give us a review on Disboard!\n\n\`\`\`fix\nWe hope you enjoy your stay.\`\`\``)
          .then(message => {
            message.react(config.emotes.wave);
          });
			});
		}
	}

}

module.exports = tosActions;