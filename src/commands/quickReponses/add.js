const { Command } = require('discord-akairo');
class aqrCommand extends Command {
  constructor() {
    super('aqr', {
      category: 'Quick Response',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['addQuickResponse', 'aqr', 'aq'],
      description: {
        content: 'Add a quick response',
        image: 'https://i.imgur.com/pd1Pi4P.gif',
        usage: '<name> <response>',
        examples: [
          'cool You are cool!'
        ]
      },
      args: [
        {
          id: 'name',
          type: async (msg, str) => {
            if(!str) return null;
            const typeResolver = this.handler.resolver.type('quickResponse');
            const qr = await typeResolver(msg, str);
            if(qr) return null;
            return str.toLowerCase();
          },
          prompt: {
            start: 'Enter a quick response name.',
            retry: '❌ A quick response with that name or alias already exists. Please enter a unique name.'
          }
        },
        {
          id: 'response',
          match: 'rest',
          prompt: {
            start: 'Enter the response.'
          }
        },
        {
          id: 'aliases',
          match: 'none',
          type: async (msg, str) => {
            if(!str) return null;
            const typeResolver = this.handler.resolver.type('quickResponse');
            const qr = await typeResolver(msg, str);
            if(qr) return null;
            return str.toLowerCase();
          },
          prompt: {
            infinite: true,
            start: 'Enter aliases in *separate* messages\nType `stop` when you\'re done',
            retry: (_, { phrase: val }) => {
              if (val.toLowerCase() === 'stop') return '❌ You must enter at least 1 alias (can be same as the name)\nType `stop` when you\'re done';
              return '❌ A quick response with that name or alias already exists. Please enter unique aliases.\nType `stop` when you\'re done';
            }
          }
        }
      ]
    });
  }

  async exec(msg, args) {
    let qr = await this.client.settings.get(msg.guild.id, 'quickResponses', []);
    qr = qr.concat(args);
    await this.client.settings.set(msg.guild.id, 'quickResponses', qr);
    const embed = msg.client.util.embed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setColor(process.env.color)
      .addFields([
        { name: 'Name', value: args.name, inline: true },
        { name: 'Aliases', value: args.aliases.map(a => `\`${a}\``).join(', '), inline: true },
        { name: 'Response', value: args.response }
      ]);
    return msg.reply('✅ Quickresponse Added!', embed);
  }
}


module.exports = aqrCommand;