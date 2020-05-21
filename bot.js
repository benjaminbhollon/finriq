// Load dependencies
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
	if (err) console.error(err);
	const jsfile = files
		.filter((t) => !t.includes('.test.'))
		.filter((f) => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		return console.log('No commands have been loaded!');
	}
	jsfile.forEach((f) => {
		const pull = require(`./commands/${f}`);
		client.commands.set(pull.config.name, pull);
		pull.config.aliases.forEach((alias) => {
			client.aliases.set(alias, pull.config.name);
		});
	});
});

// Connect to given database
connect.instantiateConnection();

client.login(process.env.BOT_TOKEN);