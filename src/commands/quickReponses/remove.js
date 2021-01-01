const { Command } = require('discord-akairo');
class rqrCommand extends Command {
  constructor() {
    super('rqr', {
      category: 'Quick Response',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['removeQuickResponse', 'rqr', 'rq', 'dq'],
      description: {
        content: 'Remove a quick response',
        usage: '<nameOrAlias>',
        examples: [
          'cool'
        ]
      },
      args: [
        {
          id: 'qr',
          match: 'rest',
          type: 'quickResponse',
          prompt: {
            start: 'Enter a quick response name.',
            retry: '❌ No quick response found with that name. Please try again.'
          }
        }
      ]
    });
  }

  async exec(msg, { qr }) {
    console.log(qr);
    const qrs = await this.client.settings.get(msg.guild.id, 'quickResponses', []);
    const newQrs = this.client.util.removeItemOnce(qrs, qr);
    await this.client.settings.set(msg.guild.id, 'quickResponses', newQrs);
    const embed = msg.client.util.embed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(process.env.color)
      .addFields([
        { name: 'Name', value: qr.name, inline: true },
        { name: 'Aliases', value: qr.aliases.map(a => `\`${a}\``).join(', '), inline: true },
        { name: 'Response', value: qr.response }
      ]);
    return msg.reply('✅ Deleted the following quick response!', embed);
  }
}


module.exports = rqrCommand;