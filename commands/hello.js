module.exports.execute = async (client, message, args) => {
  return await message.channel.send("Hey there!");
};

module.exports.config = {
  name: 'hello',
  aliases: ['hey', 'greetings'],
  module: "Utility",
  description: 'Says hello. Use to test if bot is online.',
  usage: ['hello']
};