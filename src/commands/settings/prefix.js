const { Command } = require('discord-akairo');
class prefixCommand extends Command {
  constructor() {
    super('prefix', {
      category: 'Settings',
      aliases: ['prefix'],
      userPermissions: 'MANAGE_MESSAGES',
      channel: 'guild',
      description: {
        content: 'Get or set the bot prefix',
        usage: '[newPrefix]',
        examples: [
          '',
          '?'
        ]
      },
      args: [
        {
          id: 'newPrefix',
          prompt: {
            start: 'Please provide the new prefix'
          }
        }
      ]
    });
  }

  async exec(msg, { newPrefix }) {
    const oldPrefix = this.client.settings.get(msg.guild.id, 'prefix', this.client.prefix);
    await this.client.settings.set(msg.guild.id, 'prefix', newPrefix);
    return msg.reply(`Prefix changed from \`${oldPrefix}\` to \`${newPrefix}\``);
  }
}

module.exports = prefixCommand;