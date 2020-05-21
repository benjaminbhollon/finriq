module.exports.execute = async (client, message, args) => {
  if (args.length) {
		if (args[0] == "colors") {

    } else if (args[1] == "logo") {
      const noLongerAFKMessage = new Discord.RichEmbed()
        .setTitle('The Bookery Logo')
			  .attachFiles(['https://bookery.codingprojects.org/images/bookery-logo.png'])
	      .setImage('attachment://bookery-logo.png')
        .setColor('#750384');
    } else {
      const noLongerAFKMessage = new Discord.RichEmbed()
        .setTitle('The Bookery Branding')
			  .setThumbnail('https://bookery.codingprojects.org/images/bookery-logo.png')
	      .attachFiles(['https://bookery.codingprojects.org/images/color_light.png', 'https://bookery.codingprojects.org/images/color_medium.png', 'https://bookery.codingprojects.org/images/color_dark.png'])
        .setImage('attachment://color_light.png')
        .setImage('attachment://color_medium.png')
        .setImage('attachment://color_dark.png')
        .setColor('#750384');
    }
	}
}

module.exports.config = {
	name: 'brand',
	aliases: ['colors', 'branding', 'colorscheme'],
	description: 'The Bookery\'s branding and color scheme!',
	usage: ['brand [colors | logo]']
};