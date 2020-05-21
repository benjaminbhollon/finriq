// Liora - Modular and extensible Node.js Discord bot
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const os = require('os');
const path = require('path');
const fs = require('fs');
const updateNotifier = require('update-notifier');
const yargs = require('yargs');
const opn = require('opn');
const mkdirp = require('mkdirp');
const jsonfile = require('jsonfile');
const _ = require('lodash');
const winston = require('winston');
const chalk = require('chalk');
const compose = require('koa-compose');
const prettyMs = require('pretty-ms');
const discord = require('discord.js');

const pkg = require('../package.json');

const has = Object.prototype.hasOwnProperty;

const localModuleDirectory = '../modules';

// Logger
const logLevels = {
  error: 0, warn: 1, info: 2, modules: 3, modwarn: 4, modinfo: 5, debug: 6,
};

const logger = winston.createLogger({
  levels: logLevels,
  transports: [
    new winston.transports.Console({ colorize: true, timestamp: true }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.padLevels({ levels: logLevels }),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}:${info.message}`),
  ),
  level: 'debug',
});

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  modules: 'cyan',
  modwarn: 'yellow',
  modinfo: 'green',
  debug: 'blue',
});

// Config
const configSchema = {
  discordToken: { type: 'string', default: 'Paste your bot token here.' },
  owner: { type: 'string', default: '' },
  defaultGame: { type: 'string', default: '$help for help' },
  prefix: { type: 'string', default: '$' },
  activeModules: {
    type: 'array',
    itemType: 'string',
    default: ['core', 'utils', 'search', 'autorespond', 'fun', 'player'],
  },
  commandAliases: { type: 'object', default: {} },
  defaultColors: {
    type: 'object',
    default: {
      neutral: { type: 'string', default: '#287db4' },
      error: { type: 'string', default: '#c63737' },
      success: { type: 'string', default: '#41b95f' },
    },
  },
  defaultUserCooldown: {
    type: 'object',
    default: {
      intervalMs: { type: 'number', default: 10000 },
      messageCount: { type: 'number', default: 5 },
      blockDurationMs: { type: 'number', default: 60000 },
    },
  },
  blockedUsers: { type: 'array', itemType: 'string', default: [] },
  settings: { type: 'object', default: {} },
  groups: { type: 'object', default: {} },
  commandPermissions: { type: 'object', default: {} },
  serverPermissions: { type: 'object', default: {} },
  modules: { type: 'object', default: {} },
};

// Bot
const bot = {
  client: new discord.Client(),
  log: logger,
  configWritesQueued: 0,
  moduleSources: [`${localModuleDirectory}`],
  userCooldowns: new Set(),
  userMessageCounters: {},
  firstLoadTime: Date.now(),
  util: {},
};

// Section: Config and module management

// Set the config directory to use
bot.setConfigDirectory = function setConfigDirectory(configDir) {
  this.configDir = configDir;
  this.configFile = path.join(configDir, 'config.json');
};

// Open the config file in a text editor
bot.openConfigFile = function openConfigFile() {
  bot.log.info('Opening config file in a text editor...');
  opn(this.configFile).then(() => {
    bot.log.info('Exiting.');
    process.exit(0);
  }).catch((err) => {
    this.log.error('Error opening config file.');
    throw err;
  });
};

// Load config file
bot.loadConfig = function loadConfig(callback) {
  const configExists = fs.existsSync(this.configFile);
  // If file does not exist, create it
  if (!configExists) {
    try {
      mkdirp.sync(path.dirname(this.configFile));
      fs.writeFileSync(this.configFile, JSON.stringify({}, null, 4));
    } catch (err) {
      this.log.error(chalk.red.bold(`Unable to create config.json: ${err.message}`));
      throw err;
    }
  }

  // Load the created file, even if it is empty
  this.log.info('Loading config...');
  try {
    this.config = JSON.parse(fs.readFileSync(this.configFile));
  } catch (err) {
    this.log.error(`Error reading config: ${err.message}`);
    this.log.error('Please fix the config error or delete config.json so it can be regenerated.');
    throw err;
  }

  // Recursively iterate over the config to check types and reset properties to default if they are the wrong type
  function configIterator(startPoint, startPointInSchema) {
    Object.keys(startPointInSchema).forEach((property) => {
      if (!has.call(startPoint, property)) {
        if (startPointInSchema[property].type !== 'object') {
          startPoint[property] = startPointInSchema[property].default;
        } else {
          startPoint[property] = {};
        }
      }
      if (startPointInSchema[property].type === 'object') {
        configIterator(startPoint[property], startPointInSchema[property].default);
      }
      if (!Array.isArray(startPoint[property]) && typeof startPoint[property] !== startPointInSchema[property].type) {
        startPoint[property] = startPointInSchema[property].default;
      }
    });
  }
  configIterator(this.config, configSchema);

  // Write the checked config data and open it again
  fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 4));
  if (!configExists) {
    this.log.warn('Config file created for the first time.');
    this.log.warn('Paste your Discord bot token into the botToken field and restart Liora.');
    this.openConfigFile();
  } else {
    jsonfile.readFile(this.configFile, (err, obj) => {
      if (err) {
        bot.log.error(chalk.red.bold(`Unable to load config.json: ${err.message}`));
        throw err;
      } else {
        bot.config = obj;
        callback();
      }
    });
  }
};

// Write config to file - make sure only one write at a time
bot.nextConfigWrite = function nextConfigWrite() {
  if (this.configWritesQueued === 0) return;
  this.configWritesQueued--;
  jsonfile.writeFile(this.configFile, this.config, { spaces: 4, EOL: '\n' }, (err) => {
    if (err) {
      bot.log.error(chalk.red.bold(`Unable to write config.json: ${err.message}`));
      bot.log.info(`Config data: ${JSON.stringify(bot.config, null, 4)}`);
    } else {
      bot.log.info('Config written successfully.');
    }
    bot.nextConfigWrite();
  });
};

bot.queueConfigWrite = function queueConfigWrite() {
  if (++this.configWritesQueued === 1) this.nextConfigWrite();
};

// Config manipulation
// Return if the config has a property at the specified path
bot.configHas = function configHas(pathToProperty) {
  return _.has(this.config, pathToProperty);
};

// Get a config property at the specified path
bot.configGet = function configGet(pathToProperty, defaultValue) {
  return _.get(this.config, pathToProperty, defaultValue);
};

// Set a config property at the specified path
bot.configSet = function configSet(pathToProperty, value) {
  _.set(this.config, pathToProperty, value);
  this.queueConfigWrite();
};

// Delete a config property at the specified path
bot.configUnset = function configUnset(pathToProperty) {
  _.unset(this.config, pathToProperty);
  this.queueConfigWrite();
};

// If no property is set at the path, set it to the default value and return true.
// Otherwise returns false
bot.configSetDefault = function configSetDefault(pathToProperty, defaultValue) {
  if (!_.has(this.config, pathToProperty)) {
    this.configSet(pathToProperty, defaultValue);
    return true;
  }
  if (_.get(this.config, pathToProperty) === defaultValue) return true;
  return false;
};

// Add source folder to search in when loading modules
bot.addModuleSource = function addModuleSource(directory) {
  if (fs.existsSync(directory)) this.moduleSources.push(directory);
  else this.log.warn(chalk.yellow(`Module source ${directory} does not exist`));
};

// Load module
bot.loadModule = function loadModule(name, callback) {
  this.log.modules(`Attempting to load module ${name}...`);
  if (!(name in this.modules)) {
    let found = false;
    this.moduleSources.forEach((directory) => {
      let absolutePath = path.join(directory, `${name}`);
      if (directory === localModuleDirectory) absolutePath = path.join(__dirname, absolutePath);
      if (fs.existsSync(absolutePath)) {
        if (!fs.existsSync(path.join(absolutePath, 'package.json'))) {
          absolutePath = path.join(absolutePath, 'main.js');
        }
        let newModule;
        try {
          newModule = require(absolutePath);
          newModule.path = absolutePath; // Set path property of module so we know the path to unload
          newModule.defaultAliases = {};
          newModule.commands.forEach((cmd) => {
            cmd.aliases.forEach((a) => { newModule.defaultAliases[a] = cmd.name; });
          });
        } catch (err) {
          bot.log.warn(chalk.yellow(`Unable to load module ${name}: ${err.message}`));
          bot.log.warn(`> ${err.stack}`);
          callback(err);
          return;
        }
        this.modules[name] = newModule;
        bot.log.modules(chalk.green(`Loaded module ${name}`));
        found = true;
        callback();
      }
    });
    if (!found) {
      bot.log.warn(`Module ${name} not found`);
      callback(new Error(`Module ${name} not found`));
    }
  } else {
    this.log.warn(`Module ${name} already loaded`);
    callback(new Error(`Module ${name} already loaded`));
  }
};

// Unload module
bot.unloadModule = function unloadModule(name, callback) {
  this.log.modules(`Attempting to unload module ${name}...`);
  if (name in this.modules) {
    delete require.cache[require.resolve(this.modules[name].path)];
    delete this.modules[name];
    this.log.modules(chalk.green(`Unloaded module ${name}`));
    callback();
  } else {
    this.log.warn(`Module ${name} not currently loaded`);
    callback(new Error(`Module ${name} not currently loaded`));
  }
};

// Initialize module
bot.initModule = function initModule(name, callback) {
  if (name in this.modules) {
    if (this.modules[name].init) {
      this.modules[name].init(this).then(() => {
        bot.log.modules(chalk.green(`Initialized module ${name}`));
        callback();
      }).catch((err) => {
        bot.log.warn(chalk.yellow(`Failed to initialize module ${name}: ${err.message}`));
        callback(err);
      });
    } else {
      this.log.modules(chalk.green(`Initialized module ${name}`));
      callback();
    }
  } else {
    this.log.warn(`Module ${name} not currently loaded`);
    callback(new Error(`Module ${name} not currently loaded`));
  }
};

// Section: Bot utility functions

// Return the correct command prefix for the context of a message
bot.prefixForMessageContext = function prefixForMessageContext(msg) {
  if (msg.guild && _.has(this.config.settings, `[${msg.guild.id}].prefix`)) {
    return this.config.settings[msg.guild.id].prefix;
  }
  return this.config.prefix;
};

// Does this user have group/role permission on this server?
// Returns true in these cases:
//   If the user is the bot owner
//   If the permission group is all users
//   If the user is in the global permission group
//   If the user is in the permission role on this server
bot.hasPermission = function hasPermission(member, user, group, role) {
  if (user.id === this.config.owner) return true;
  if (group === 'all') return true;
  if (Object.keys(this.config.groups).includes(group) && this.config.groups[group].includes(user.id)) return true;
  if (member && member.roles.has(role)) return true;
  return false;
};

// Returns the command object for a command name
bot.getCommandNamed = function getCommandNamed(command, callback) {
  let cmdStr = command;
  const moduleNames = Object.keys(this.modules);
  let err = true;
  // Search for configured and default aliases
  if (cmdStr in this.config.commandAliases) cmdStr = this.config.commandAliases[cmdStr];
  else moduleNames.forEach((name) => { cmdStr = this.modules[name].defaultAliases[cmdStr] || cmdStr; });
  moduleNames.forEach((name) => {
    const found = this.modules[name].commands.find(cmd => cmd.name === cmdStr);
    if (found && err) {
      err = false;
      callback(found);
    }
  });
  if (err) callback();
};

// Show emoji embed with args
bot.sendEmojiEmbed = function sendEmojiEmbed(channel, emoji, color, title, description) {
  const embed = new discord.RichEmbed()
    .setTitle(`${emoji}   ${title}`)
    .setColor(color);
  if (description) embed.setDescription(description);
  channel.send({ embed });
};

// Show emoji embeds with standard emojis
bot.sendError = function sendError(channel, title, description) {
  this.sendEmojiEmbed(channel, '❌', this.config.defaultColors.error, title, description);
};

bot.sendSuccess = function sendSuccess(channel, title, description) {
  this.sendEmojiEmbed(channel, '✅', this.config.defaultColors.success, title, description);
};

bot.sendInfo = function sendInfo(channel, title, description) {
  this.sendEmojiEmbed(channel, 'ℹ️', this.config.defaultColors.neutral, title, description);
};

// Generate documentation
bot.generateDocs = function generateDocs(file) {
  let contents = '### Table of Contents\n';
  let docs = '';
  let modCount = 0;
  let cmdCount = 0;
  const modules = Object.getOwnPropertyNames(this.modules);
  modules.forEach((mod) => {
    modCount++;
    contents += `* [${mod}](#module-${mod})\n`;
    docs += `### Module \`${mod}\`\n`;
    bot.modules[mod].commands.forEach((cmd) => {
      cmdCount++;
      docs += `#### ${cmd.name}\n\`${bot.config.prefix}${cmd.name} ${cmd.argumentNames.join(' ')}\`  \nDefault permission level: \`${cmd.permissionLevel}\`  \n${cmd.aliases.length ? `Default aliases: \`${cmd.aliases.join('\`, \`')}\`  \n` : ''}${cmd.description}\n\n`;
    });
  });
  const out = `## Liora Discord Bot Command Documentation\n${modCount} modules, ${cmdCount} commands  \nGenerated ${new Date()}.\n\n${contents}\n${docs}`;
  fs.writeFile(file, out, 'utf8', (err) => {
    if (err) this.log.error(`Error saving command documentation: ${err.message}`);
    else this.log.info(chalk.green('Saved command documentation.'));
  });
};

// Section: Message handling middleware pipeline

// Middleware that discards messages if they are sent by another bot
const checkMessageAuthor = function checkMessageAuthor(c, next) {
  if (!c.message.author.bot) next();
};

// Middleware that discards messages from blocked users
const blockHandler = function blockHandler(c, next) {
  if (!bot.config.blockedUsers.includes(c.message.author.id)) next();
};

// Middleware that detects commands in messages and parses arguments
const commandDetector = function commandDetector(c, next) {
  if (c.message.content.indexOf(bot.prefixForMessageContext(c.message)) === 0) {
    const argString = c.message.content.slice(bot.prefixForMessageContext(c.message).length).trim();
    const matches = argString.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g);
    if (matches) {
      c.args = matches.map(a => a.replace(/^['"]+|['"]$/g, ''));
      c.command = c.args.shift().toLowerCase();
      bot.log.debug(`Detected command ${c.command} with args ${c.args.join(', ')}`);
    }
    next();
  }
};

// Middleware that detects if messages are being sent too fast and blocks users who exceed the limit
const rateLimiter = function rateLimiter(c, next) {
  if (!bot.userCooldowns.has(c.message.author.id)) {
    bot.userCooldowns.add(c.message.author.id);
    setTimeout(() => {
      bot.userCooldowns.delete(c.message.author.id);
      bot.userMessageCounters[c.message.author.id] = 0;
    }, bot.config.defaultUserCooldown.intervalMs);
  }
  bot.userMessageCounters[c.message.author.id] = bot.userMessageCounters[c.message.author.id] || 0;
  if (++bot.userMessageCounters[c.message.author.id] < bot.config.defaultUserCooldown.messageCount) {
    next();
  } else if (bot.userMessageCounters[c.message.author.id] === bot.config.defaultUserCooldown.messageCount) {
    const embed = new discord.RichEmbed()
      .setTitle('⌛ Rate limit exceeded')
      .setDescription(`User ${bot.util.username(c.message.author)} blocked for ${prettyMs(bot.config.defaultUserCooldown.blockDurationMs)}`)
      .setColor(bot.config.defaultColors.error);
    c.message.channel.send({ embed });
    bot.config.blockedUsers.push(c.message.author.id);
    setTimeout(() => {
      _.remove(bot.config.blockedUsers, i => i === c.message.author.id);
    }, bot.config.defaultUserCooldown.blockDurationMs);
  }
};

// Final middleware that finds and executes commands
const commandDispatcher = function commandDispatcher(c) {
  bot.getCommandNamed(c.command, (cmd) => {
    if (cmd) {
      if (c.args.length >= _.filter(cmd.argumentNames, i => !_.endsWith(i, '?')).length) {
        // Determine permission level for the message context
        // Use the global group override and the role override if they exist
        const permissionLevel = bot.config.commandPermissions[c.command] || cmd.permissionLevel;
        const roleOverride = c.message.guild ? bot.config.serverPermissions[c.message.guild.id][c.command] || '' : '';
        if (bot.hasPermission(c.message.member, c.message.author, permissionLevel, roleOverride)) {
          // Execute the command with args, message object, and bot object
          cmd.execute(c.args, c.message, bot).catch((err) => {
            bot.sendError(c.message.channel, `Error executing command \`${c.command}\``, `${err.message}`);
          });
        } else {
          bot.sendEmojiEmbed(c.message.channel, '🔒', 'You do not have permission to use this command.');
        }
      } else {
        bot.sendError(c.message.channel, 'Not enough arguments.', `Use \`${bot.prefixForMessageContext(c.message)}${c.command} ${cmd.argumentNames.join(' ')}\`:\n ${cmd.description}`);
      }
    }
  });
};

// Handle a message by running all of the bot's middleware
bot.onMessage = async function onMessage(msg) {
  const container = { message: msg, bot };
  // Load author check middleware first, then modules, then rate limiter and other command-related things
  let middleware = [];
  const moduleNames = Object.keys(this.modules);
  moduleNames.forEach((name) => {
    if (this.modules[name].middleware && this.modules[name].middleware.length > 0) {
      middleware = _.concat(middleware, this.modules[name].middleware);
    }
  });
  middleware = _.concat(middleware,
    [checkMessageAuthor, blockHandler, commandDetector, rateLimiter, commandDispatcher]);
  compose(middleware)(container);
};

// Section: Bot load and connect event handlers

// Initialize and load the bot
bot.load = function load(callback) {
  // Set up some properties
  this.lastLoadTime = Date.now();
  this.config = {};
  this.modules = {};

  // Load config, load modules, and login
  this.loadConfig(() => {
    this.log.info('Loading modules...');
    this.config.activeModules.forEach((module) => { this.loadModule(module, () => {}); });
    this.log.info('Connecting...');
    this.client.login(this.config.discordToken);
    callback();
  });
};

// Called when client logs in
bot.onConnect = async function onConnect() {
  this.log.info(chalk.cyan(`Logged in as: ${this.client.user.username} (id: ${this.client.user.id})`));
  this.client.user.setActivity(this.config.defaultGame);

  // Update permissions config for servers
  const servers = this.client.guilds.array();
  servers.forEach((server) => {
    this.log.info(`In server ${server.id}: ${server.name}`);
    this.configSetDefault(`serverPermissions[${server.id}]`, {});
    this.configSetDefault(`settings[${server.id}]`, {});
  });

  // Init modules
  const moduleNames = Object.keys(this.modules);
  let moduleCount = 0;
  moduleNames.forEach((name) => {
    this.initModule(name, (err) => {
      if (!err && ++moduleCount >= moduleNames.length) this.lastLoadDuration = Date.now() - this.lastLoadTime;
    });
  });
};

// Disconnect, unload all modules, and reconnect
bot.restart = function restart() {
  this.log.info('Restarting: resetting client...');
  this.client.destroy().then(() => {
    this.config.activeModules.forEach((module) => { bot.unloadModule(module, () => {}); });
    this.load();
  });
};

// Section: Discord utility functions

// Return a user's full username with discriminator
bot.util.username = function username(user) {
  return `${user.username}#${user.discriminator}`;
};

// Is a string a snowflake id?
bot.util.isSnowflake = function isSnowflake(string) {
  return /^\d{17,19}$/.test(string);
};

// Return an array of member objects from text containing a user mention, name, or id
bot.util.parseUsername = function parseUsername(userString, server) {
  const query = userString.toLowerCase();
  const userIds = query.match(/^<@!?(\d{17,19})>$/); // Is it a user mention?
  if (!userIds) {
    const matchingMembers = server.members.filter((m) => {
      const name = m.user.username.toLowerCase();
      const nick = m.nickname ? m.nickname.toLowerCase() : name;
      const discrim = m.user.discriminator;
      return name.includes(query) || nick.includes(query) || `${name}#${discrim}` === query || m.id === query;
    }).array();
    return matchingMembers.length ? matchingMembers.map(m => m.user) : null;
  }
  const u = server.members.get(userIds[1]);
  return u ? [u.user] : null;
};

// Return an array of role objects from text containing a role mention or name
bot.util.parseRole = function parseRole(roleString, server) {
  const query = roleString.toLowerCase();
  const roleIds = query.match(/^<@&(\d{17,19})>$/); // Is it a role mention?
  if (!roleIds) {
    const matchingRoles = server.roles.filter(r => r.name.toLowerCase().includes(query)).array();
    return matchingRoles.length ? matchingRoles : null;
  }
  const r = server.roles.get(roleIds[1]);
  return r ? [r] : null;
};

// Return an array of channel objects from text containing a channel mention or name
bot.util.parseChannel = function parseChannel(channelString, server) {
  const query = channelString.toLowerCase();
  const channelIds = query.match(/^<#(\d{17,19})>$/); // Is it a channel mention?
  if (!channelIds) {
    const matchingChannels = server.channels.filter(c => c.name.toLowerCase().includes(query)).array();
    return matchingChannels.length ? matchingChannels : null;
  }
  const c = server.channels.get(channelIds[1]);
  return c ? [c] : null;
};

// Section: Code starts running here

// Register event listeners
bot.client.on('ready', bot.onConnect.bind(bot));
bot.client.on('error', (err) => { bot.log.error(chalk.red(`Client error: ${err.message}`)); });
bot.client.on('reconnecting', () => { bot.log.info('Reconnecting...'); });
bot.client.on('disconnect', (evt) => { bot.log.warn(chalk.yellow(`Disconnected: ${evt.reason} (${evt.code})`)); });
bot.client.on('message', bot.onMessage.bind(bot));

// Set default config directory
bot.setConfigDirectory(path.join(os.homedir(), '.liora-bot'));

// Run the bot automatically if module is run instead of imported
if (!module.parent) {
  const args = yargs.usage('Usage: liora [options]')
    .example('liora --configDir .', 'run using the current directory as the config directory')
    .alias('c', 'configDir')
    .nargs('c', 1)
    .describe('c', 'Config directory (defaults to ~/.liora-bot/)')
    .boolean('openConfig')
    .describe('openConfig', 'Open config.json in the default text editor')
    .boolean('generateDocs')
    .describe('generateDocs', 'Generate Markdown file containing command documenation.')
    .help('h')
    .alias('h', 'help')
    .epilog('Liora Discord bot copyright 2019 jackw01. Released under the MIT license.')
    .argv;
  updateNotifier({ pkg }).notify();
  bot.log.info(chalk.cyan('Liora is running in standalone mode'));
  if (args.configDir) bot.setConfigDirectory(args.configDir);
  if (args.openConfig) bot.openConfigFile();
  else bot.load(() => { if (args.generateDocs) bot.generateDocs('commanddoc.md'); });
}

module.exports = bot;