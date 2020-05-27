class backspeakCheckAction {
  static async checkForGame(message) {
    Afks.sync().then(() =>

		Afks.create({
			game: afkMessage,
			user: sender.id,
			cooldown: Date.now()
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
						message.channel.send(`Welcome back, ${message.member.nickname ? message.member.nickname : message.author.username}!`).then(message => message.delete(5000)).catch('Error sending message.');
						reaction.message.delete().catch(() => console.log('Tried deleting afk message that was already deleted'));
						return;
					}
				});
			}
			console.error('Afk sequelize error: ', err);
		}));
  }
}

module.exports = backspeakCheckAction;