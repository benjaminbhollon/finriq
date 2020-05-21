module.exports.execute = async (client, message, args) => {
  if (parseInt(args[0])) {
    return await message.channel.send(`_Hugs ${args[0]}._\n_Don't worry, it'll be alright._`);
  } else {
    var name = args.join(" ");
    //Replace with mention if possible
    message.channel.members.forEach(member => {
      if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
    });
    if (name != "@everyone") {
      return await message.channel.send(`_Hugs ${name}._\n_Don't worry, it'll be alright._`);
    } else {
      return await message.channel.send("_Hugs the entire server._\n_Don't worry, it'll be alright._");
    }
  }
};

module.exports.config = {
  name: 'hug',
  description: 'Hugs specified user.',
  usage: ['hug [user]']
};

function setName(name) {
  function setName(input) {
    name = input;
  }
  return name;
}