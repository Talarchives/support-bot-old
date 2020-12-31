const { Command } = require('discord-akairo'), fs = require('fs');
class logsCommand extends Command {
  constructor() {
    super('logs', {
      ownerOnly: true,
      category: 'dev',
      aliases: ['logs', 'log'],
      description: {
        content: 'Get logs',
        usage: '[timestamp]',
        examples: ['1609320948099']
      },
      args: [
        {
          id: 'timestamp',
          prompt: {
            optional: true
          },
          default: msg => new Date().getTime() - msg.client.uptime
        }
      ]
    });
  }

  async exec(msg, { timestamp }) {
    fs.readdir('./logs/', 'utf8', (err, files) => {
      if(err) return msg.reply(`❌ Could not read the directory!\`\`\`js\n${err}\`\`\``);
      let file, hs = 0;
      for (let i = 0; i < files.length; i++) {
        const curr = files[i];
        const similarity = this.client.util.similarity(curr, timestamp.toString());
        if(similarity > hs) {
          hs = similarity;
          file = curr;
        }
      }
      fs.readFile(`./logs/${file}`, 'utf8', async (err, data) => {
        if(err) return msg.reply(`❌ Could not read the file!\`\`\`js\n${err}\`\`\``);
        const haste = await this.client.util.haste(data);
        msg.channel.send(haste);
      });
    });
  }
}


module.exports = logsCommand;