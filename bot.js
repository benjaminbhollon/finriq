// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

/*// Connect to database
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : '3306',
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB,
  charset : 'utf8mb4'
});*/

var game;

var writeathon = {};

const arrays = new require('./arrays.js');

var bookNo = -1;

var backspeakListening = false;

var afk = [];
var afkCooldown = [];

function sortProperties(obj)
{
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
		var x=a[1].toLowerCase(),
			y=b[1].toLowerCase();
		return x<y ? -1 : x>y ? 1 : 0;
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

function shuffle(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function addSummaryMessage(id) {
  game.summaryMessages.push(id);
}

client.on('ready', () => {
  console.log('I am ready!');
  game = {};
  shuffle(arrays.gameList);
  shuffle(arrays.books);
  client.user.setActivity(arrays.gameList[1], {
    type: "PLAYING"
  });
  setInterval(function () {
    shuffle(arrays.gameList);
    client.user.setActivity(arrays.gameList[1], {
      type: "PLAYING"
    });
  }, 600000);
});

// Create an event listener for messages
client.on('message', message => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`

  message.mentions.users.forEach(user => {
    if (afk.indexOf(user.id) != -1) {
      message.channel.send(user.tag + " is away right now and may not see your message. Try sending them a DM if it's important to ensure they'll be able to find the message when they return.");
    }
  });
  var mentionsAfk = false;

  if (afk.indexOf(message.author.id) != -1 && afkCooldown.indexOf(message.author.id) == -1 && !(message.content.toLowerCase().indexOf("morning") != -1 && message.content.toLowerCase().indexOf("bookery") != -1)) {
    message.author.send("It appears that you are no longer AFK. Would you like to turn AFK off? If so, react with a ✅ to this message. This message will be deleted in 30 seconds if you do not reply.").then(response => {
      afkCooldown.push(message.author.id);
      setTimeout(function () {
        afkCooldown.splice(afkCooldown.indexOf(message.author.id), 1);
      }, 300000);
      var lastMessage;
      message.author.dmChannel.fetchMessages({ limit: 1 }).then(messages => {
        lastMessage = messages.first();
        lastMessage.react("✅");
        const filter = () => {
          return true;
        };
        lastMessage.awaitReactions(filter, {max:2, time:30000,errors:['time']}).then(collected => {
          afk.splice(afk.indexOf(message.author.id), 1);
          message.author.send("AFK has been turned off.");
        })
        .catch(collected => {
          lastMessage.delete();
        });
      });
    });
  }

  if (message.content.substring(0,1).toLowerCase() == '.') {
      if (message.content.substring(0,2).toLowerCase() == '. ') {
        var args = message.content.substring(2).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        console.log("1");
      } else {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        console.log("2");
      }
      switch(cmd.toLowerCase()) {
        case "hello":
          message.channel.send('Hey there! Nice to meet you!');
          break;
        case "words":
          switch(args[0]) {
            case "intro":
              message.channel.send("__**Word-a-thon Rules**__\nWhenever you write, use the command `.words add [n]` to add your word count to the leaderboard (example: `.words add 1971`). When you want to see the rankings, use `.words leaderboard`.\nThe leaderboard will be reset weekly.");
              break;
            case "add":
              if (writeathon[message.author.tag]) {
                writeathon[message.author.tag] += parseInt(args[1]);
              } else {
                writeathon[message.author.tag] = parseInt(args[1]);
              }
              sortProperties(writeathon);
              message.channel.send("Added **" + args[1] + " words** to your wordcount. Run `.words leaderboard` to see the rankings!");
              break;
            case "leaderboard":
              var leaderboard = "Here are the rankings so far:\n";
              var l = 1;
              for (var player in writeathon) {
                leaderboard += "\n" + l + ". " + player + ": " + writeathon[player] + " words written";
                l++;
              }
              if (isEmpty(writeathon)) {
                leaderboard += "\nNo one's written anything yet. Come on, y'all! You can do better than that.";
              }
              leaderboard += "\n";
              message.channel.send(leaderboard);
              break;
            case "reset":
              if (message.author.id == "530925903757443094") {
                writeathon = {};
                message.channel.send("Leaderboard reset.");
              } else {
                message.channel.send("You do not have permission to reset the leaderboard.");
              }
              break;
            default:
              message.channel.send('Hmm... I don\'t know that command. Try `.help` to get a list of commands.');
              break;
          }
          break;
        case "backspeak":
          switch(args[0]) {
            case "intro":
              message.channel.send("__**Backspeak Rules**__\nBackspeak is really a very simple game. When you run `.backspeak`, I will post a random string of words to the chat. The first person to post the words reversed in order in the chat wins.");
              break;
            default:
              shuffle(arrays.words);
              message.channel.send('**3...**');
              setTimeout(function () {
                message.channel.send('**2...**');
                setTimeout(function () {
                  message.channel.send('**1...**');
                  setTimeout(function () {
                    message.channel.send(arrays.words.slice(0,10).join(" "));
                    backspeakListening = arrays.words.slice(0,10).reverse().join(" ");
                  }, 1000);
                }, 1000);
              }, 1000);
              break;
          }
          break;
        case "synopsis":
          switch(args[0]) {
            case "intro":
              message.channel.send("__**Guess That Synopsis! Rules**__\nWhen the game starts, I will give everyone a random book title. Each player will DM me a made-up summary of what the book is about.\nOnce everyone has sent in their summaries, I'll list them in the chat where everyone can see them, but no one will see who posted which summary. In addition, I will throw in the _real_ summary of the book. Everyone will vote on what they think the real summary is.\nOnce people have voted, I tally up the points. If someone thinks your summary is the real one, you get one point. If you guess the correct summary, you get three points. Points carry over into the next round until the `.synopsis end` command is run.\nSound fun? run `.synopsis start [min-players]` to start!");
              break;
            case "start":
              if (isEmpty(game)) {
                message.channel.send("React to this message with a :pencil2: to join the game! The game won't start until at least " + (args[1] ? args[1] : 2) + " players join! Once the game has started, players can join without reacting to this. Simply start following the instructions and your points will be added to the leaderboard!");
                args[1] = parseInt(args[1]);
                var lastMessage;
                message.channel.fetchMessages({ limit: 1 }).then(messages => {
                  lastMessage = messages.first();
                  lastMessage.react("✏");
                  const filter = () => {
                    return true;
                  };
                  lastMessage.awaitReactions(filter, {max:1+(args[1] ? args[1] : 2), time:300000,errors:['time']}).then(collected => {
                    game = {owner:message.author,round:0,roundInProgress:false};
                    message.channel.send("<@" + game.owner.id + "> We have enough players! Start the first round by running `.synopsis round`!");
                  })
                  .catch(collected => {
                    message.channel.send("Not enough players.");
                  });
                });
              } else {
                message.channel.send("There is already a game running. If you are the owner of the current game, run `.synopsis end` to end the current game.");
              }
              break;
            case "round":
              if (!isEmpty(game) && !game.roundInProgress && message.author.id == game.owner.id) {
                game.round++;
                game.roundInProgress = true;
                message.channel.send("__**Round " + game.round + "**__\nYou can join in at any time, simply by following the instructions. You will automatically be added to the leaderboard.");
                message.channel.send("Here comes your prompt! _(Cue drumroll)_");
                setTimeout(function () {
                  bookNo++;
                  game.book = arrays.books[bookNo % arrays.books.length];
                  message.channel.send("The title is _" + game.book.title + "_!\nMake up a synopsis for this story and DM it to me. You have five minutes.");
                  game.summaries = [{author:false,summary:game.book.summary}];
                  game.acceptingSummaries = true;
                  setTimeout(function () {
                    game.acceptingSummaries = false;
                    message.guild.roles.forEach(role => {
                      if (role.id == "693502791788003401") {
                        message.channel.overwritePermissions(role, {'SEND_MESSAGES': false});
                      }
                    });
                    message.channel.send("Time's up!\n\nI'm about to send all the synopses you wonderful writers came up with, but I'll throw in the actual synopsis of the book. When I do that, you're going to vote for one synopsis that you think is the real one.");
                    shuffle(game.summaries);
                    game.summaryMessages = [];
                    for (var i in game.summaries) {
                      message.channel.send((parseInt(i) + 1) + ". " + game.summaries[i].summary);
                      message.channel.fetchMessages({ limit: 1 }).then(messages => {
                        lastMessage = messages.first();
                        addSummaryMessage(lastMessage.id);
                        lastMessage.react("✅");
                      });
                    }
                    message.channel.send("Can we give all of those wonderful synopses a big round of applause? :clap: :clap: :clap:");
                    setTimeout(function () {
                      message.channel.send("Thank you.");
                      message.channel.send("Now, vote for the synopsis you think is the real one by ticking the ✅. You have forty-five seconds. If you guess correctly, you get 2 points! You can vote for your own, but it's worth less points than guessing the right one and it might give you away.\nIf you haven't been playing up till now, you can join in here! The title of the book is _" + game.book.title + "_. Can you guess which synopsis is the correct one?");
                      message.guild.roles.forEach(role => {
                        if (role.id == "693502791788003401") {
                          message.channel.overwritePermissions(role, {'SEND_MESSAGES': true});
                        }
                      });
                      setTimeout(function () {
                        message.channel.send("The results are in! It turns out that this was the real summary:\n\"" + game.book.summary + "\"\nThe real book was written by " + game.book.author + ". Great job, though, that was fun!");
                        game.roundInProgress = false;
                        if (!(game.leaderboard)) game.leaderboard = {};
                        //Calculate leaderboard
                        game.voted = [];
                        for (var s in game.summaries) {
                          if (game.summaries[s].author) { //Made up
                            if (!game.leaderboard[game.summaries[s].author]) {
                              game.leaderboard[game.summaries[s].author] = 0;
                            }
                            message.channel.messages.forEach(msg => {
                              if (msg.id == game.summaryMessages[s]) {
                                msg.reactions.forEach(reaction => {
                                  if (game.voted.indexOf(game.summaries[s].author.id) && game.summaries[s].author.id != msg.author.id) {
                                    game.leaderboard[game.summaries[s].author] += reaction.count - 1;
                                    game.voted.push(game.summaries[s].author.id);
                                  }
                                });
                              }
                            });
                          } else { //Real
                            message.channel.messages.forEach(msg => {
                              if (msg.id == game.summaryMessages[s]) {
                                msg.reactions.forEach(reaction => {
                                  reaction.users.forEach(user => {
                                    if (!user.bot && game.voted.indexOf(user.id)) {
                                      if (!game.leaderboard[user]) {
                                        game.leaderboard[user] = 2;
                                      } else {
                                        game.leaderboard[user]+=2;
                                      }
                                      game.voted.push(user.id);
                                    }
                                  });
                                });
                              }
                            });
                          }
                        }
                        game.leaderboard = sortProperties(game.leaderboard);
                        var leaderboard = "Here are the rankings so far:\n";
                        var l = 1;
                        for (var player in game.leaderboard) {
                          leaderboard += "\n" + l + ". " + player + ": " + game.leaderboard[player] + " points";
                          l++;
                        }
                        if (isEmpty(game.leaderboard)) {
                          leaderboard += "No players have earned points. Come on, y'all! You can do better than that.";
                        }
                        leaderboard += "\n\nYou can view the leaderboard at any time by running `.synopsis leaderboard`.";
                        message.channel.send(leaderboard);
                        message.channel.send("<@" + game.owner.id + "> You can start a new round by running `.synopsis round` or you can end the game now with `.synopsis end`.");
                      }, 45000);
                    }, 5000);
                  }, 300000);
                }, 5000);
              } else if (game.roundInProgress) {
                message.channel.send("There is already a round in progress. Finish the round before starting a new one.");
              } else if (!isEmpty(game)) {
                message.channel.send("You are not the owner of the game. Only the owner of the game can start a new round.");
              } else {
                message.channel.send("There is no game running. Run `.synopsis start` to start a new game!");
              }
              break;
            case "leaderboard":
                var leaderboard = "Here are the rankings so far:\n";
                var l = 1;
                for (var player in game.leaderboard) {
                  leaderboard += "\n" + l + ". " + player + ": " + game.leaderboard[player] + " points";
                  l++;
                }
                if (isEmpty(game.leaderboard)) {
                  leaderboard += "\nNo players have earned points. Come on, y'all! You can do better than that.";
                }
                message.channel.send(leaderboard);
              break;
            case "end":
              if (game.roundInProgress == false) {
                if (isEmpty(game)) {
                  message.channel.send("There is no game running. Run `.synopsis start` to start a new game!");
                } else if (message.author.id == game.owner.id || message.author.id == "530925903757443094") {
                  game = {};
                  message.channel.send("The game is over! Thanks for playing!");
                } else {
                  message.channel.send("Only the game owner can end the game.");
                }
              } else {
                message.channel.send("Please wait until the round is over to end the game.");
              }
              break;
            default:
              message.channel.send('Hmm... I don\'t know that command. Try `.help` to get a list of commands.');
              break;
          }
          break;
         break;
        case "rps":
          message.channel.send('**Rock...**');
          setTimeout(function () {
            message.channel.send('**Paper...**');
            setTimeout(function () {
              message.channel.send('**Scissors!!!**');
            }, 4000);
          }, 4000);
          break;
        case "shoot":
          message.channel.send('Violence is never the answer. Do... Do you need a `.hug`?');
          break;
        case "hug":
          if (args[0] && args[0].toLowerCase() != "me") {
            if (parseInt(args[0])) {
              message.channel.send("_hugs <@" + args[0] + ">_\nDon't worry, it'll be all right.");
            } else {
              function setName(input) {
                name = input;
              }
              var name = args.join(" ");
              //Replace with mention if possible
              message.channel.members.forEach(member => {
                if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
              });
              message.channel.send("_hugs " + name + "_\nDon't worry, it'll be all right.");
            }
          } else {
            message.channel.send("_hugs " + message.author + "_\nDon't worry, it'll be all right.");
          }
          message.delete();
          break;
          case "jail":
            if (args[0] && args[0].toLowerCase() != "me") {
              if (parseInt(args[0])) {
                message.channel.send("_puts <@" + args[0] + "> in jail_");
              } else {
                function setName(input) {
                  name = input;
                }
                var name = args.join(" ");
                //Replace with mention if possible
                message.channel.members.forEach(member => {
                  if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
                });
                message.channel.send("_puts " + name + " in jail_");
              }
            } else {
              message.channel.send("_puts " + message.author + " in jail_");
            }
            message.delete();
            break;
        case "afk":
          if (afk.indexOf(message.author.id) == -1) {
            afk.push(message.author.id);
            message.author.send("You have been marked as FK and anyone pinging you will be notified that you are unable to respond.");
            afkCooldown.push(message.author.id);
            setTimeout(function () {
              afkCooldown.splice(afkCooldown.indexOf(message.author.id), 1);
            }, 300000);
            message.delete();
          } else {
            afk.splice(afk.indexOf(message.author.id), 1);
            message.author.send("AFK has been turned off.");
            message.delete();
          }
          break;
        case "summon":
          if (args[0] && args[0].toLowerCase() != "me") {
            if (parseInt(args[0])) {
              message.channel.send("_:candle: " + message.author + " summons <@" + args[0] + "> :candle:_");
            } else {
              function setName(input) {
                name = input;
              }
              var name = args.join(" ");
              //Replace with mention if possible
              message.channel.members.forEach(member => {
                if (member.displayName.toLowerCase().indexOf(name.toLowerCase()) != -1 || member.user.username.toLowerCase().indexOf(name.toLowerCase()) != -1) name = "<@" + member.id + ">";
              });
              if (name != "@everyone") {
                message.channel.send("_:candle: " + message.author + " summons " + name + " :candle:_");
              } else {
                message.channel.send("_:candle: " + message.author + " summons the entire server :candle:_");
              }
            }
          } else {
            message.channel.send("_:candle: " + message.author + " summons nobody :candle:_");
          }
          message.delete();
          break;
        case "coffee":
          message.channel.send(Math.random() < 0.5 ? ":coffee:" : ":coffin:");
          break;
        case "tea":
          message.channel.send(Math.random() < 0.5 ? ":tea:" : ":deciduous_tree:");
          break;
        case "help":
          if (!args.length) {
            message.channel.send("__**Finriq Commands**__\n*Use `.help [category]` for commands under that category.*\n`General`\n`Games`\n`Word-a-Thon`\n`Read-a-Thon`")
          } else if (args[0].toLowerCase() == "general") {
            message.channel.send("__**General Commands**__\n`.afk`: Notifies users who try to ping you that you are away and can't reply to messages at the moment. AFK is automatically turned on when you send \"Good night, Bookery!\" and off when you send \"Good morning, Bookery!\"\n`.help [category | command]`: Displays category list, or commands under a category if one is specified.\n`.hello`: Says hello. Use to test if bot is online.\n`.jail [user]`: puts _user_ in jail, or author if _user_ not present\n`.shoot [user]`: Shoots _user_\n`.summon [user]`: summons _user_\n`.hug [user]`: hugs _user_ if present, if not hugs author of command");
          } else if (args[0].toLowerCase() == "games") {
            message.channel.send("__**Game Commands**__\n`.backspeak`: Starts a round of backspeak.\n`.rps`: Starts a rock paper scissors game.");
          } else if (args[0].toLowerCase().replace('-', '') == "wordathon" || args[0].toLowerCase() == "wat") {
            message.channel.send('__**Word-a-Thon Commands**__\n*Under construction. Use at your own risk.*\n`.synopsis intro`: Gives an intro to the game.\n`.synopsis start [min-players]`: Starts a new game after min-players (default 2) players join.\n`.synopsis round`: Starts the next round of the game. Requires game creator.\n`.synopsis leaderboard`: Views the rankings so far.\n`.synopsis end`: Ends the current game. Requires game creator. (Cannot be run while game is in progress)\n')
          } else if (args[0].toLowerCase().replace('-', '') == "readathon" || args[0].toLowerCase() == "rat") {
          }
          break;
      }
  } else if (game.acceptingSummaries && message.author.bot == false && message.channel.type === 'dm') {
    var submitted = false;
    for (var p in game.summaries) {
      if (game.summaries[p].author.id == message.author.id) {
        game.summaries[p].summary = message.content;
        submitted = true;
        message.channel.send("Your submission has been updated.");
      }
    }
    if (!submitted) {
      game.summaries.push({author:message.author,summary:message.content});
      message.channel.send("I have recorded your response. To change it, send another message here before the time limit runs out.");
    }
  } else if (message.channel.id == "711269048591056916") {
    message.react("👋");
  } else if (message.channel.id == "705240176842113024") {
    message.react("💯");
  } else if (backspeakListening) {
    if (message.content == backspeakListening) {
      message.channel.send("And the winner is... " + message.author + "!");
      backspeakListening = false;
    }
  } else if ((message.content.toLowerCase().indexOf("goodnight") != -1 || message.content.toLowerCase().indexOf("good night") != -1) && message.content.toLowerCase().indexOf("bookery") != -1 && !message.author.bot) {
    message.react("🌛");
    if (afk.indexOf(message.author.id) == -1) {
      afk.push(message.author.id);
      afkCooldown.push(message.author.id);
      setTimeout(function () {
        afkCooldown.splice(afkCooldown.indexOf(message.author.id), 1);
      }, 300000);
      message.author.send("You have been marked as Away-From-Keyboard and anyone pinging you will be notified that you are unable to respond.");
    }
  } else if (message.content.toLowerCase().indexOf("morning") != -1 && message.content.toLowerCase().indexOf("bookery") != -1 && !message.author.bot) {
    message.react("🌄");
    if (afk.indexOf(message.author.id) != -1) {
      afk.splice(afk.indexOf(message.author.id), 1);
      message.author.send("AFK has been turned off.");
    }
  } else if (message.content.toLowerCase() == ":slight_smile:"|| message.content.toLowerCase() == "🙂") {
    message.react("🙃");
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.BOT_TOKEN);