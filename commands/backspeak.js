module.exports.execute = async (client, message, args) => {
  return await message.channel.send("Under construction.");
};

module.exports.config = {
  name: 'backspeak',
  aliases: ['backspeak'],
  module: "Games",
  description: 'Under construction.',
  usage: ['backspeak']
};