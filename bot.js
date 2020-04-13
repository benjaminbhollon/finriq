// Import the discord.js module
const Discord = require('discord.js');
var auth = require('./auth.json');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

var game;

var writeathon = {};

var words = ["you" , "I" , "to" , "the" , "and" , "that" , "of" , "me" , "in" , "this" , "for" , "no" , "have" , "my" , "just" , "not" , "do" , "be" , "on" , "your" , "was" , "we" , "with" , "but" , "all" , "well" , "he" , "about" , "right" , "get" , "here" , "out" , "if" , "her" , "she" , "can" , "up" , "want" , "now" , "go" , "him" , "there" , "one" , "why" , "see" , "come" , "good" , "they" , "really" , "when" , "back" , "from" , "were" , "yes" , "his" , "or" , "who" , "because" , "some" , "then" , "say" , "an" , "way" , "us" , "little" , "never" , "too" , "sure" , "more" , "over" , "our" , "sorry" , "where" , "let" , "maybe" , "down" , "man" , "very" , "by" , "anything" , "much" , "any" , "life" , "even" , "off" , "please" , "thank" , "only" , "help" , "two" , "talk" , "people" , "God" , "still" , "wait" , "into" , "find" , "again" , "thing" , "call" , "told" , "great" , "before" , "better" , "ever" , "night" , "than" , "away" , "first" , "believe" , "fine" , "home" , "after" , "last" , "these" , "put" , "around" , "stop" , "long" , "always" , "listen" , "those" , "big" , "lot" , "kind" , "wrong" , "through" , "new" , "guess" , "care" , "bad" , "mom" , "remember" , "together" , "dad" , "leave" , "mother" , "place" , "understand" , "actually" , "hear" , "baby" , "nice" , "father" , "else" , "stay" , "their" , "course" , "might" , "mind" , "every" , "enough" , "try" , "hell" , "came" , "someone" , "own" , "family" , "whole" , "another" , "house" , "yourself" , "idea" , "ask" , "best" , "must" , "old" , "woman" , "hello" , "which" , "room" , "money" , "left" , "tonight" , "real" , "son" , "hope" , "name" , "same" , "happy" , "pretty" , "girl" , "sir" , "show" , "already" , "may" , "next" , "three" , "found" , "world" , "honey" , "myself" , "exactly" , "probably" , "hurt" , "both" , "while" , "dead" , "alone" , "since" , "excuse" , "start" , "kill" , "hard" , "today" , "car" , "ready" , "until" , "without" , "whatever" , "deal" , "took" , "once" , "friend" , "head" , "stuff" , "most" , "worry" , "second" , "part" , "truth" , "school" , "face" , "forget" , "business" , "each" , "cause" , "soon" , "wife" , "use" , "chance" , "run" , "move" , "anyone" , "person" , "bye" , "somebody" , "heart" , "such" , "point" , "later" , "meet" , "anyway" , "phone" , "reason" , "lost" , "look" , "bring" , "case" , "wish" , "tomorrow" , "trust" , "check" , "end" , "late" , "anymore" , "five" , "least" , "town" , "year" , "make" , "mean" , "play" , "hate" , "ago" , "beautiful" , "fact" , "crazy" , "party" , "sit" , "open" , "afraid" , "between" , "important" , "rest" , "fun" , "kid" , "glad" , "everyone" , "day" , "sister" , "minute" , "everybody" , "bit" , "couple" , "either" , "daughter" , "under" , "break" , "door" , "set" , "close" , "easy" , "doctor" , "far" , "walk" , "need" , "trouble" , "mine" , "though" , "time" , "different" , "hospital" , "anybody" , "alright" , "wedding" , "shut" , "able" , "die" , "perfect" , "police" , "stand" , "hit" , "story" , "dinner" , "against" , "funny" , "husband" , "almost" , "stupid" , "pay" , "answer" , "four" , "office" , "cool" , "news" , "child" , "half" , "yours" , "moment" , "sleep" , "young" , "men" , "sonny" , "lucky" , "pick" , "sometimes" , "them" , "bed" , "also" , "date" , "line" , "lose" , "fire" , "free" , "hand" , "serious" , "shit" , "behind" , "inside" , "high" , "ahead" , "wonderful" , "fight" , "past" , "cut" , "quite" , "number" , "sick" , "game" , "eat" , "nobody" , "death" , "along" , "finally" , "upset" , "seem" , "safe" , "children" , "front" , "shot" , "love" , "clear" , "hot" , "six" , "drink" , "absolutely" , "how" , "sweet" , "alive" , "sense" , "happen" , "special" , "bet" , "blood" , "lie" , "full" , "meeting" , "dear" , "coffee" , "sound" , "fault" , "water" , "ten" , "women" , "welcome" , "buy" , "hour" , "speak" , "think" , "Christmas" , "body" , "order" , "outside" , "hang" , "worse" , "company" , "mistake" , "handle" , "spend" , "totally" , "control" , "marriage" , "power" , "president" , "unless" , "send" , "picture" , "hundred" , "change" , "explain" , "certainly" , "sign" , "boy" , "relationship" , "hair" , "choice" , "anywhere" , "secret" , "future" , "weird" , "luck" , "touch" , "crane" , "question" , "obviously" , "pain" , "straight" , "grace" , "white" , "fast" , "word" , "food" , "none" , "drive" , "work" , "marry" , "light" , "test" , "drop" , "frank" , "sent" , "city" , "dream" , "protect" , "twenty" , "class" , "surprise" , "forever" , "poor" , "mad" , "except" , "gun" , "know" , "dance" , "take" , "especially" , "situation" , "besides" , "week" , "himself" , "act" , "worth" , "top" , "expect" , "rather" , "involve" , "swear" , "piece" , "busy" , "law" , "black" , "movie" , "catch" , "country" , "less" , "perhaps" , "step" , "fall" , "dog" , "win" , "personal" , "admit" , "problem" , "murder" , "strong" , "evil" , "feel" , "honest" , "eye" , "broke" , "miss" , "tired" , "evening" , "human" , "red" , "entire" , "trip" , "club" , "suppose" , "calm" , "imagine" , "fair" , "blame" , "street" , "apartment" , "court" , "terrible" , "clean" , "learn" , "relax" , "million" , "charity" , "accident" , "prove" , "smart" , "message" , "small" , "interest" , "table" , "become" , "mouth" , "pregnant" , "middle" , "ring" , "careful" , "shall" , "team" , "ride" , "figure" , "wear" , "shoot" , "stick" , "ray" , "follow" , "angry" , "instead" , "buddy" , "write" , "early" , "angel" , "nick" , "ran" , "war" , "forgive" , "jail" , "lunch" , "eight" , "thousand" , "music" , "tough" , "tape" , "count" , "college" , "boyfriend" , "proud" , "agree" , "birthday" , "bill" , "seven" , "history" , "share" , "offer" , "hurry" , "feet" , "wonder" , "simple" , "decision" , "building" , "finish" , "voice" , "herself" , "would" , "list" , "mess" , "deserve" , "cute" , "dress" , "interesting" , "Jesus" , "hotel" , "enjoy" , "quiet" , "road" , "eve" , "short" , "beat" , "mention" , "clothe" , "neither" , "fix" , "respect" , "spent" , "prison" , "attention" , "near" , "bar" , "pass" , "gift" , "dark" , "self" , "normal" , "aunt" , "dollar" , "lawyer" , "apart" , "certain" , "plan" , "girlfriend" , "floor" , "whether" , "everything" , "present" , "earth" , "private" , "box" , "cover" , "judge" , "sake" , "mommy" , "possibly" , "worst" , "station" , "accept" , "blow" , "strange" , "save" , "plane" , "yesterday" , "quick" , "lately" , "stuck" , "lovely" , "security" , "report" , "difference" , "store" , "bag" , "ball" , "single" , "doubt" , "blue" , "deep" , "park" , "record" , "lord" , "join" , "key" , "captain" , "card" , "crime" , "window" , "return" , "guilty" , "difficult" , "soul" , "joke" , "service" , "magic" , "uncle" , "promise" , "public" , "bother" , "island" , "seriously" , "cell" , "lead" , "broken" , "advice" , "somehow" , "push" , "concern" , "usually" , "boss" , "rule" , "summer" , "thirty" , "risk" , "letting" , "officer" , "support" , "afternoon" , "born" , "apologise" , "seat" , "nervous" , "across" , "song" , "charge" , "patient" , "boat" , "brain" , "hide" , "general" , "nine" , "huge" , "breakfast" , "horrible" , "age" , "awful" , "pleasure" , "driving" , "system" , "sell" , "quit" , "dying" , "chief" , "faith" , "gay" , "month" , "visit" , "screw" , "letter" , "decide" , "double" , "sad" , "press" , "forward" , "fool" , "smell" , "spell" , "memory" , "mark" , "slow" , "hungry" , "board" , "position" , "hearing" , "rose" , "kitchen" , "force" , "fly" , "during" , "space" , "kick" , "other" , "grab" , "discuss" , "third" , "cat" , "fifty" , "mile" , "fat" , "reading" , "idiot" , "rock" , "suddenly" , "agent" , "bunch" , "destroy" , "track" , "shoes" , "scene" , "peace" , "demon" , "low" , "consider" , "drunk" , "tell" , "knock" , "bell" , "cash" , "give" , "department" , "nose" , "turn" , "keep" , "beer" , "sooner" , "plenty" , "extra" , "attack" , "ground" , "whose" , "weekend" , "matter" , "wrote" , "type" , "opportunity" , "king" , "impossible" , "book" , "machine" , "waste" , "pretend" , "danger" , "wall" , "jump" , "proof" , "complete" , "arrest" , "perfectly" , "warm" , "pull" , "twice" , "easier" , "suit" , "romantic" , "drug" , "comfortable" , "fit" , "divorce" , "begin" , "closely" , "ruin" , "although" , "smile" , "laugh" , "fish" , "treat" , "fear" , "amber" , "guy" , "otherwise" , "excited" , "mail" , "green" , "stole" , "notice" , "excellent" , "pop" , "paper" , "bottom" , "note" , "sudden" , "church" , "bathroom" , "sing" , "glass" , "tree" , "contact" , "shop" , "reach" , "cry" , "cake" , "partner" , "bus" , "computer" , "study" , "star" , "area" , "wind" , "chicken" , "dry" , "hero" , "error" , "are" , "build" , "sea" , "Saturday" , "add" , "birth" , "bird" , "grandmother" , "heavy" , "west" , "lesson" , "heat" , "speed" , "milk" , "rain" , "sugar" , "market" , "process" , "stone" , "serve" , "river" , "super" , "monkey" , "pig" , "chat" , "signal" , "cup" , "bee" , "a" , "above" , "addition" , "among" , "amount" , "angle" , "animal" , "appear" , "apple" , "art" , "as" , "at" , "bank" , "base" , "bear" , "belong" , "block" , "bone" , "brown" , "cannot" , "capital" , "carry" , "centre" , "century" , "circle" , "cloud" , "cost" , "cold" , "column" , "common" , "compere" , "condition" , "contain" , "continue" , "cook" , "copy" , "cow" , "create" , "cross" , "crowd" , "describe" , "desert" , "design" , "detail" , "dictionary" , "direction" , "ear" , "east" , "like" , "edge" , "effect" , "egg" , "element" , "energy" , "engine" , "England" , "English" , "example" , "express" , "famous" , "farm" , "field" , "finger" , "flat" , "flower" , "foot" , "forest" , "form" , "fresh" , "fruit" , "garden" , "gas" , "gold" , "group" , "grow" , "hat" , "hole" , "horse" , "hunt" , "ice" , "inch" , "include" , "increase" , "indicate" , "information" , "insect" , "instrument" , "iron" , "is" , "itself" , "job" , "lady" , "lake" , "land" , "language" , "large" , "lay" , "leg" , "length" , "level" , "lift" , "main" , "many" , "map" , "march" , "bacon" , "gap" , "pan"];

var books = [
  {
    "title": "The Man Who Loved Children",
    "author": "Christina Stead",
    "summary": "Every family lives in an evolving story, told by all its members, inside a landscape of portentous events and characters. Their view of themselves is not shared by people looking from outside in--visitors, and particularly not relatives--for they have to see something pretty humdrum, even if, as in this case, the fecklessness they complain of is extreme."
  },
  {
    "title": "American Youth",
    "author": "Phil LaMarche",
    "summary": "A controlled, essential, and powerful tale of a teenager in southern New England who is confronted by a terrible moral dilemma following a firearms accident in his home. This tragedy earns him the admiration of a sinister gang of boys at his school and a girl associated with them."
  },
  {
    "title": "My Abandonment",
    "author": "Peter Rock",
    "summary": "A thirteen-year-old girl and her father live in Forest Park, the enormous nature preserve in Portland, Oregon. There they inhabit an elaborate cave shelter, bathe in a nearby creek, store perishables at the water’s edge, use a makeshift septic system, tend a garden, even keep a library of sorts. Once a week, they go to the city to buy groceries and otherwise merge with the civilized world. But one small mistake allows a backcountry jogger to discover them, which derails their entire existence, ultimately provoking a deeper flight."
  },
  {
    "title": "Random Acts of Senseless Violence",
    "author": "Jack Womack",
    "summary": "Lola Hart is an ordinary twelve-year-old girl. She comes from a comfortable family, attends an exclusive private school, loves her friends Lori and Katherine, teases her sister Boob. But in the increasingly troubled city where she lives (a near-future Manhattan) she is a dying breed. Riots, fire, TB outbreaks, roaming gangs, increasing inflation, political and civil unrest all threaten her way of life, as well as the very fabric of New York City."
  },
  {
    "title": "Little Big Man",
    "author": "Thomas Berger",
    "summary": "Jack Crabb was brought up by Indians. He won the name Little Big Man. He dressed in skins, feasted on dog, loved four wives and saw his people butchered by the horse soldiers of General Custer, the man he had sworn to kill."
  },
  {
    "title": "The Time of Man",
    "author": "Elizabeth Madox Roberts",
    "summary": "_The Time of Man_ traces the coming of age of Ellen Chesser, the daughter of a poor itinerant farmer. Against all privations and the forces that would subdue her, Ellen is sustained by a sense of wonder and by an awareness of her own being. Reduced to the bare elements of life, her world becomes a ceremony of daily duties that bind her to the natural world and her family."
  },
  {
    "title": "The Warriors",
    "author": "J. Glenn Gray",
    "summary": "J. Glenn Gray entered the army as a private in May 1941, having been drafted on the same day he was informed of his doctorate in philosophy from Columbia University. He was discharged as a second lieutenant in October 1945, having been awarded a battlefield commission during fighting in France. Gray saw service in North Africa, Italy, France, and Germany in a counter-espionage unit."
  },
  {
    "title": "Buffalo Soldiers",
    "author": "Robert O'Connor",
    "summary": "Peace is hell and the U.S. Army is its ninth circle. In that hell, Specialist Ray Elwood is the ultimate survivor: a high-stakes drug dealer, bureaucratic con artist, and shrewd collector of other people's secrets. Elwood is contemplating cleaning up his act, although doing so will require one last, epic heroin deal."
  },
  {
    "title": "American Purgatorio",
    "author": "John Haskell",
    "summary": "The story of a happily married man who discovers, as he walks out of a convenience store, that his wife has suddenly vanished."
  },
  {
    "title": "Voyage in the Dark",
    "author": "Jean Rhys",
    "summary": "Anna Morgan, eighteen years old, is catapulted to England from the West Indies after the death of her beloved father. Working as a chorus girl, Anna drifts into the demi-monde of Edwardian London. But there, dismayed by the unfamiliar cold and greyness, she is absolutely alone and unconsciously floating from innocence to harsh experience."
  },
  {
    "title": "Good Morning, Midnight",
    "author": "Jean Rhys",
    "summary": "Augustine, a brilliant, aging astronomer, is consumed by the stars. For years he has lived in remote outposts, studying the sky for evidence of how the universe began. At his latest posting, in a research center in the Arctic, news of a catastrophic event arrives. The scientists are forced to evacuate, but Augustine stubbornly refuses to abandon his work."
  },
  {
    "title": "Our Sister Killjoy: or, Reflections from a Black-Eyed Squint",
    "author": "Ama Ata Aidoo",
    "summary": "A young woman from post-independent Ghana goes to Europe."
  },
  {
    "title": "The Book of Ebenezer Le Page",
    "author": "G. B. Edwards",
    "summary": "Ebenezer Le Page, cantankerous, opinionated, and charming, is one of the most compelling literary creations of the late twentieth century. Eighty years old, Ebenezer has lived his whole life on the Channel Island of Guernsey, a stony speck of a place caught between the coasts of England and France yet a world apart from either. Ebenezer himself is fiercely independent, but as he reaches the end of his life he is determined to tell his own story and the stories of those he has known. He writes of family secrets and feuds, unforgettable friendships and friendships betrayed, love glimpsed and lost."
  },
  {
    "title": "The Box Man",
    "author": "Kobo Abe",
    "summary": "The story of a nameless man who decides to take up residence inside a large box with an eyehole cut into it, through which he is free to observe the world without participating in it. As he sheds his own identity and assumes the identity of a Box Man, he discovers that he has not severed his relationship to others but formed a new and more dangerous one."
  },
  {
    "title": "The Groves of Academe",
    "author": "Mary McCarthy",
    "summary": "Jocelyn College is staffed by self-righteous hypocrites, dim-witted bureaucrats, and petty grifters. The students are earnest and clueless. The place runs on paranoia and betrayal. And yet, somehow, the life of the mind endures, if only barely and by default."
  }
];

var backspeakListening = false;

var gameList = [".synopsis", ".backspeak"];

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function addSummaryMessage(id) {
  game.summaryMessages.push(id);
}

client.on('ready', () => {
  console.log('I am ready!');
  game = {};
  shuffle(gameList);
  client.user.setActivity(gameList[1], {
    type: "PLAYING"
  });
});

// Create an event listener for messages
client.on('message', message => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.content.substring(0,1).toLowerCase() == '.') {
      var args = message.content.substring(1).split(' ');
      var cmd = args[0];
      args = args.splice(1);
      switch(cmd.toLowerCase()) {
        case "hello":
          message.channel.send('Hey there! Nice to meet you!');
          break;
        case "words":
          switch(args[0]) {
            case "intro":
              message.channel.send("__**Write-a-thon Rules**__\nWhenever you write, use the command `.words add [n]` to add your word count to the leaderboard (example: `.words add 1971`). When you want to see the rankings, use `.words leaderboard`.\nThe leaderboard will be reset weekly.");
              break;
            case "add":
              if (writeathon[message.author.tag]) {
                writeathon[message.author.tag] += parseInt(args[1]);
              } else {
                writeathon[message.author.tag] = parseInt(args[1]);
              }
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
              shuffle(words);
              message.channel.send(words.slice(0,10).join(" "));
              backspeakListening = words.slice(0,10).reverse().join(" ");
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
                  game.book = books[Math.floor(Math.random() * books.length)];
                  message.channel.send("The title is _" + game.book.title + "_!\nMake up a synopsis for this story and DM it to me. You have three minutes.");
                  game.summaries = [{author:false,summary:game.book.summary}];
                  game.acceptingSummaries = true;
                  setTimeout(function () {
                    game.acceptingSummaries = false;
                    message.guild.roles.forEach(role => {
                      if (role.id == "693515167840993371") {
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
                        if (role.id == "693515167840993371") {
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
                  }, 180000);
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
              if (isEmpty(game)) {
                message.channel.send("There is no game running. Run `.synopsis start` to start a new game!");
              } else if (message.author.id == game.owner.id || message.author.id == "530925903757443094") {
                game = {};
                message.channel.send("The game is over! Thanks for playing!");
              } else {
                message.channel.send("Only the game owner can end the game.");
              }
              break;
            default:
              message.channel.send('Hmm... I don\'t know that command. Try `.help` to get a list of commands.');
              break;
          }
          break;
        case "shoot":
          message.channel.send('Violence is never the answer. Do... Do you need a `.hug`?');
          break;
        case "hug":
          message.channel.send("_hugs " + message.author + "_\nDon't worry, it'll be all right.");
          break;
        case "help":
          message.channel.send("__**Finriq Commands List**__\n`.help`: Displays command list.\n`.hello`: Says hello.\n`.shoot [user]`: Shoots _user_\n`.hug`: Finriq gives user a hug\n\n**Guess that Synopsis!**\n`.synopsis intro`: Gives an intro to the game.\n`.synopsis start [min-players]`: Starts a new game after _min-players_ (default 2) players join.\n`.synopsis round`: Starts the next round of the game. Requires game creator.\n`.synopsis leaderboard`: Views the rankings so far. `.synopsis end`: Ends the current game. Requires game creator. DO NOT RUN WHILE ROUND IS IN PROGESS\n\n**Backspeak**\n`.backspeak intro`: Gives an intro to the game\n`.backspeak`: Starts a round of backspeak. Only one round at a time, please.\n\n**Word-a-thon**\n`.words intro`: Introduces Word-a-thon.\n`.words add [n]` Adds _n_ words to the user's total.\n`.words leaderboard`: Views the rankings.\n`.words reset`: Resets the leaderboard. Requires privs.");
          break;
      }
  } else if (game.acceptingSummaries && message.author.bot == false && message.channel.type === 'dm') {
    var submitted = false;
    for (var p in game.summaries) {
      if (game.summaries[p].author.id == message.author.id) {
        game.summaries[p].summary = message.content;
        submitted = true;
        message.channel.send("Your sumission has been updated.");
      }
    }
    if (!submitted) {
      game.summaries.push({author:message.author,summary:message.content});
      message.channel.send("I have recorded your response. To change it, send another message here before the time limit runs out.");
    }
  } else if (backspeakListening) {
    if (message.content == backspeakListening) {
      message.channel.send("And the winner is... " + message.author + "!");
      backspeakListening = false;
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);