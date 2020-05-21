const discord = require('discord.js');
const _ = require('lodash');

module.exports.commands = [
  {
    name: 'intro',
    description: 'Learn more about the Word-a-Thon from an introduction!',
    permissionLevel: 'all',
    aliases: ['introduction', 'i'],
    async execute(args, msg) {
      message.channel.send("__**Word-a-thon Rules**__\nWhenever you write, use the command `.words add [n]` to add your word count to the leaderboard (example: `.words add 1971`). When you want to see the rankings, use `.words leaderboard`.\nThe leaderboard will be reset weekly.");
    },
  }
]