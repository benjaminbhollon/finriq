const config = require('../config.json');
const afkAction = require('../eventActions/afkMessageCheckAction');
const reactions = require('../eventActions/reactions');
const backspeak = require('../eventActions/backspeak');

module.exports = async (client, message) => {
  if (message.content.toLowerCase().indexOf("good") != -1 && message.content.toLowerCase().indexOf("night") != -1 && message.content.toLowerCase().indexOf("bookery") != -1) {
    client.commands.get("afk").execute(client, message, ["Went to sleep.", "auto"]);
    return await message.react("🌛");
  } else if (message.content.toLowerCase().indexOf("good") != -1 && message.content.toLowerCase().indexOf("morning") != -1 && message.content.toLowerCase().indexOf("bookery") != -1) {
    afkAction.checkIfUserIsAFK(message);
    return await message.react("🌄");
  }

	if (!message.guild || message.author.bot) return;
	const args = message.content.split(/\s+/g); // Return the message content and split the prefix.
	const command =
		message.content.startsWith(config.prefix) &&
		args.shift().slice(config.prefix.length).toLowerCase();

	if (command) {
		const commandfile =
			client.commands.get(command) ||
			client.commands.get(client.aliases.get(command));

		if (commandfile) {
			commandfile.execute(client, message, args); // Execute found command
		}
	}
	
	afkAction.checkIfUserIsAFK(message);
	afkAction.checkForMention(message);
	reactions.checkIfCorrect(message);
	backspeak.checkForGame(message);
};