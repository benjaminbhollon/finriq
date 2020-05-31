// Load dependencies
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const connect = require('./databaseFiles/connect.js');
const unirest = require('unirest');

var req = unirest("GET", "https://timshim-quotes-v1.p.rapidapi.com/quotes");

req.headers({
	"x-rapidapi-host": "timshim-quotes-v1.p.rapidapi.com",
	"x-rapidapi-key": "b9ff9a4789mshb1174b62d6f8900p17b784jsnaeae0a7605a6",
	"useQueryString": true
});

req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});

const client = new Discord.Client();

fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	const jsfile = files.filter((f) => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		return console.log('No errors have been loaded!');
	}
	jsfile.forEach((file) => {
		const event = require(`./events/${file}`);
		const eventName = file.split('.')[0];
		client.on(eventName, event.bind(null, client));
	});
})

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

// Set custom status
try {
	client.on('ready', () => { client.user.setActivity(config.playing), {type: "playing"} });
} catch(err) {
	console.log("Status error!" + err);
}

// Connect to given database
connect.instantiateConnection();

client.login(process.env.BOT_TOKEN);