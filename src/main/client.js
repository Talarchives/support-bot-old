const
  { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } = require('discord-akairo'),
  path = require('path'),
  guildModel = require('../models/Guild'),
  { prefix, startPresence } = require('../config.json');
  
class BotClient extends AkairoClient {
  constructor() {
    super({
      ownerID: '462870395314241537'
    }, {
      disableMentions: 'everyone',
      presence: startPresence
    });

    this.commandHandler = new CommandHandler(this, {
      directory: path.join(__dirname, '..', 'commands'),
      prefix: async msg => {
        if (!msg.guild) return prefix;
        return await this.settings.get(msg.guild.id, 'prefix', prefix);
      },
      aliasReplacement: /-/g,
      commandUtil: true,
      allowMention: false,
      argumentDefaults: {
        prompt: {
          start: 'Enter a value',
          modifyStart: (message, str) => `${str}\n\n${message.author}\n> Type \`cancel\` to cancel the command\n> Waiting for input <a:loading:781902642267029574>`,
          retry: 'Please enter a correct value.',
          modifyRetry: (message, str) => `${str}\n\n${message.author}\n> Type \`cancel\` to cancel the command\n> Waiting for input <a:loading:781902642267029574>`,
          timeout: 'Command timed out.',
          ended: msg => execHelp(msg),
          cancel: msg => `❌ ${msg.author} Command cancelled.`,
          time: 30e3,
          retries: 2
        },
        otherwise: '❌ An error occurred!'
      }
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: path.join(__dirname, '..', 'inhibitors')
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname, '..', 'listeners')
    });

    // Mongoose Provider
    this.settings = new MongooseProvider(guildModel);

    this.listenerHandler.setEmitters({
      process: process,
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler
    });
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.commandHandler.resolver.addType('uniqueQR', async (m, str) => {
      if(!str) return null;
      const qr = await m.client.settings.get(m.guild.id, 'quickResponses', []);
      if(qr.length && qr.find(q => q.name === str.toLowerCase() || (q.aliases.length && q.aliases.includes(str.toLowerCase())))) return null;
      return str.toLowerCase();
    });
  }
  async login(token) {
    this.listenerHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.commandHandler.loadAll();
    await this.settings.init();
    return super.login(token);
  }
}

let client = new BotClient();
client = Object.assign(client, require('../functions/index'));

module.exports = client;

function execHelp(msg) {
  const args = { command: msg.util.parsed.command, cancel: true };
  msg.client.commandHandler.findCommand('help').exec(msg, args);
}