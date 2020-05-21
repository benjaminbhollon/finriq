module.exports.execute = async (client, message, args) => {
  return await message.channel.send(Math.random() < 0.5 ? ":tea:" : ":deciduous_tree:");
};

module.exports.config = {
	name: 'tea',
	aliases: ['chai', 'tree', 'troulette'],
	description: 'I will choose either :tea: or :deciduous_tree:. (Tea-drinker\'s version of the coffee command)',
	usage: ['tea']
};