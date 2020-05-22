// Get the afk Table stored in the SQLite database
const Afks = require('../databaseFiles/afkTable.js');


module.exports.execute = async (client, message, args) => {
	try {
		message.delete();
	} catch(err) {
		console.log("Delete error" + err);
	}
	
	const sender = message.author;
	const afkMessage = args.length > 0 ? args.join(' ') : 'They didn\'t tell us where they went...';

	Afks.sync().then(() =>

		Afks.create({
			message: afkMessage,
			user: sender.id,
			timestamp: Date.now()
		}).then(() => {
			try {
				message.channel.send('I have marked you as AFK. Anyone who pings you will be notified you are away.').then(msg => msg.delete(5000).catch());
			}
			catch(err) {
				console.log(err);
			}
		}).catch(err => {
			if (err.name == 'SequelizeUniqueConstraintError') {
				Afks.destroy({
					where: {
						user: sender.id
					}
				}).then(result => {
					// User successfully removed from table
					if (result == 1) {
						sender.send('Welcome back, knight!').then(message => message.delete(5000));
						reaction.message.delete().catch(() => console.log('Tried deleting afk message that was already deleted'));
						return;
					}
				});
			}
			console.error('Afk sequelize error: ', err);
		}));
};

module.exports.config = {
	name: 'afk',
	aliases: ['afk', 'away'],
	module: "Utility",
	description: 'I will mark you as being away. When people tag you, they will be notified that you are not present.',
	usage: ['afk [message]']
};