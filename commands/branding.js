const Discord = require('discord.js');

module.exports.execute = async (client, message, args) => {
  if (args.length) {
		if (args[0] == "colors") {

    } else if (args[0] == "logo") {
      const brandEmbed = new Discord.RichEmbed()
        .setTitle('The Bookery Logo')
			  .attachFiles(['https://bookery.codingprojects.org/images/bookery-logo.png'])
	      .setImage('attachment://bookery-logo.png')
        .setColor('#750384');
        return await message.channel.send(brandEmbed);
    } else {
      const brandEmbed = new Discord.RichEmbed()
        .setTitle('The Bookery Branding')
			  .setThumbnail('https://bookery.codingprojects.org/images/bookery-logo.png')
	      .attachFiles(['https://bookery.codingprojects.org/images/color_scheme.png'])
        .setImage('attachment://color_scheme.png')
        .setColor('#750384');
        return await message.channel.send(brandEmbed);
    }
  }
}

module.exports.config = {
	name: 'brand',
	aliases: ['colors', 'branding', 'colorscheme'],
	description: 'The Bookery\'s branding and color scheme!',
	usage: ['brand [colors | logo]']
};