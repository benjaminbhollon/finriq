// Get the afk Table stored in the SQLite database
const config = require('../config.json');


module.exports.execute = async (client, message, args) => {
	return await message.channel.send("Hey there!");
};

module.exports.config = {
	name: 'agree'
};