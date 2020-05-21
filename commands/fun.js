module.exports.execute = async (client, message, args) => {
	if (message == "coffee") {
    return await message.channel.send(Math.random() < 0.5 ? ":coffee:" : ":coffin:");
  } else if (message == "tea") {
    message.channel.send(Math.random() < 0.5 ? ":tea:" : ":deciduous_tree:");
  }
};

module.exports.coffee = {
	name: 'coffee',
	aliases: ['cappuccino', 'coffin', 'croulette'],
	description: 'I will choose either :coffee: or :coffin:. (Finriq version of Russian Roulette)',
	usage: ['coffee']
};

module.exports.tea = {
	name: 'tea',
	aliases: ['chai', 'tree', 'troulette'],
	description: 'I will choose either :tea: or :deciduous_tree:. (Tea-drinker\'s version of the coffee command)',
	usage: ['tea']
};