const { Command } = require('discord-akairo'), fs = require('fs');
class logsCommand extends Command {
  constructor() {
    super('logs', {
      ownerOnly: true,
      category: 'dev',
      aliases: ['logs', 'log'],
      description: {
        content: 'Get logs'
      }
    });
  }

  async exec(msg) {
    fs.readFile('./logs/.log', 'utf8', async (err, data) => {
      if(err) return msg.reply(`❌ Could not read the file!\`\`\`js\n${err}\`\`\``);
      const haste = await this.client.util.haste(data);
      msg.channel.send(haste);
    });
  }
}


module.exports = logsCommand;