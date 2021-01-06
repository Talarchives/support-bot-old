const { Command } = require('discord-akairo');
module.exports = class listscCommand extends Command {
  constructor() {
    super('listsc', {
      category: 'Support Channel',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['listSupportChannels', 'lsc'],
      description: {
        content: 'Get a list of support channels'
      }
    });
  }

  async exec(msg) {
    const scs = await this.client.settings.get(msg.guild.id, 'supportChannels', []);
    if(!scs.length) return msg.reply('❌ No support channels have been added in this server!');
    const embed = this.client.util.embed()
      .setColor(process.env.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setTitle('List of Support Channels');
    scs.forEach((sc, i) => {
      embed.addField(`__*#${i + 1}*__`, `**Support Channel:** <#${sc.supportChannel}>\n**Ticket Category:** <#${sc.ticketCategory}>\n**Logs Channel:** <#${sc.logChannel}>`, true);
    });
    return msg.channel.send(embed);
  }
};