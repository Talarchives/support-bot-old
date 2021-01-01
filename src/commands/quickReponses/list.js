const { Command } = require('discord-akairo');
class lqrCommand extends Command {
  constructor() {
    super('lqr', {
      category: 'Quick Response',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['listQuickResponses', 'listQuickResponse', 'lqr', 'lq'],
      description: {
        content: 'List quick responses',
        usage: '[nameOrAlias]',
        examples: [
          'cool'
        ]
      },
      args: [
        {
          id: 'qr',
          match: 'rest',
          type: 'quickResponse',
          default: null
        }
      ]
    });
  }

  async exec(msg, { qr }) {
    const embed = msg.client.util.embed()
      .setColor(process.env.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    if (qr) {
      embed
        .addFields([
          { name: 'Name', value: qr.name, inline: true },
          { name: 'Aliases', value: qr.aliases.map(a => `\`${a}\``).join(', '), inline: true },
          { name: 'Response', value: qr.response }
        ]);
      return msg.channel.send(embed);
    } else {
      const qrs = await this.client.settings.get(msg.guild.id, 'quickResponses', []);
      if(!qrs.length) return msg.reply('❌ No quick responses found!');
      embed
        .setTitle('Quick Responses')
        .setDescription(qrs.map(q => `\`${q.name}\``).join(', '));
      return msg.channel.send(embed);
    }
  }
}


module.exports = lqrCommand;