const config = require('../config.json');

class tosActions {
	static userAcceptsTOS(reaction, user, client) {
    console.log("Hello world!");
		if (reaction.message.channel.id === config.channels.tos
            && reaction._emoji.name === config.emotes.acceptTOS) {
			reaction.message.guild.fetchMember(user.id).then(guildMember => {
        let role1 = client.guilds.get("698499113188065310");
        let role2 = client.guilds.get("698499669554102404");
        let role3 = client.guilds.get("698500041295265844");

        // Add roles and send welcome message to the welcome channel
        member.addRole(role1).catch(console.error);
        member.addRole(role2).catch(console.error);
        member.addRole(role3).catch(console.error);

        client.channels.get(config.channels.welcome).send(`🎉 **A new member has arrived, <@&693517619457818634>!** 🎉\nWelcome to The Bookery <@${user.id}>!`)
          .then(message => {
            message.react(config.emotes.wave);
          });
        user.send(`\`\`\`fix
Welcome to The Bookery!\`\`\`
To begin, say hello in <#693498873083330654> and follow our Quick Start Guide below.

**Quick Start Guide**
• You can grab some roles in <#693563108077076490>.
• Introduce yourself with the template pinned in <#711269048591056916>.
• To learn more about the server, check out <#693500724704837653>.

**Reading Groups**
We are a reading server, and we host multiple reading groups! Learn more in the info channel, and join in the self roles channel! Have fun!

**About Me**
I'm Finriq, a custom bot made for The Bookery! I am always growing. Use \`.help\` in <#693561975887888444> for more on what I can do.`);
			});
		}
	}

}

module.exports = tosActions;