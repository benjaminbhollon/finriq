module.exports.execute = async (client, message, args) => {
  return await message.channel.send("Under construction.");
};

module.exports.config = {
  name: 'synopsis',
  aliases: ['syn'],
  module: "Games",
  description: 'Under construction.',
  usage: ['synopsis']
};