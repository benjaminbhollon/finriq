module.exports.execute = async (client, message, args) => {
  await message.channel.send('**Rock...**');
  setTimeout(function () {
    await message.channel.send('**Paper...**');
    setTimeout(function () {
      await message.channel.send('**Scissors!!!**');
    }, 4000);
  }, 4000);
};

module.exports.config = {
  name: 'rockpaperscissors',
  aliases: ['rps'],
  description: 'Starts a rock paper scissors game.',
  usage: ['rockpaperscissors']
};