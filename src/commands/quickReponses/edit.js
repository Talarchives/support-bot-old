const { Command } = require('discord-akairo');
class eqrCommand extends Command {
  constructor() {
    super('eqr', {
      category: 'Quick Response',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['editQuickResponse', 'eqr', 'eq'],
      description: {
        content: 'Edit a quick response',
        usage: '<name> <newResponse>',
        examples: [
          'cool You are cool and nice'
        ]
      },
      args: [
        {
          id: 'qr',
          type: 'quickResponse',
          prompt: {
            start: 'Enter name or alias of a quick response.',
            retry: '❌ No quick response exists with that name or alias. Please try again.'
          }
        },
        {
          id: 'newResponse',
          match: 'rest',
          prompt: {
            start: 'Enter a new response'
          }
        }
      ]
    });
  }

  async exec(msg, { qr, newResponse }) {
    const embed = msg.client.util.embed()
      .setColor(process.env.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .addFields([
        { name: 'Name', value: qr.name, inline: true },
        { name: 'Aliases', value: qr.aliases.map(a => `\`${a}\``).join(', '), inline: true },
        { name: 'Old Response', value: qr.response },
        { name: 'New Response', value: newResponse }
      ]);
    let qrs = await this.client.settings.get(msg.guild.id, 'quickResponse', []);
    qrs = this.client.util.removeItemOnce(qrs, qr);
    qr.response = newResponse;
    await this.client.settings.set(msg.guild.id, 'quickResponse', qrs);
    return msg.reply('✅ Quick Response Edited Successfully!', embed);
  }
}


module.exports = eqrCommand;