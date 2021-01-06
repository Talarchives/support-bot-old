const { Command } = require('discord-akairo');
module.exports = class closeTicketCommand extends Command {
  constructor() {
    super('closeTicket', {
      category: 'Tickets',
      aliases: ['closeTicket', 'close'],
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: [
        'EMBED_LINKS',
        'MANAGE_CHANNELS'
      ],
      description: {
        content: 'Close a ticket',
        usage: '[Reason]',
        examples: [
          '',
          'Problem Solved'
        ]
      },
      args: [
        {
          id: 'reason',
          match: 'rest',
          prompt: {
            optional: true
          },
          default: '[Not Provided]'
        }
      ]
    });
  }

  async exec(msg, { reason }) {
    await msg.channel.lockPermissions();
    const typeResolver = this.handler.resolver.type('supportChannel');
    const sch = await typeResolver(msg, msg.channel.parentID);
    if (!sch) return msg.reply('❌ This ticket for a moved to a different category, unable to close.');
    const typeResolver2 = this.handler.resolver.type('ticket');
    const ticket = await typeResolver2(msg, msg.channel.id);
    if (!ticket) return msg.reply('❌ This command can only be used in a ticket channel');
    const logChannel = msg.guild.channels.cache.get(sch.logChannel);
    if (!logChannel) return msg.reply(`❌ The log channel does not exist, please add log channel with command: \`${msg.util.parsed.prefix}esc ${msg.channel} <newLogChannel>\``);
    let tickets = await this.client.settings.get(msg.guild.id, 'tickets', []);
    await msg.reply('⏳ Closing ticket, please wait.');
    const msgs = msg.channel.messages.fetch();
    const reas = [`Info: ${msg.channel.topic}\nQuestion: ${ticket.question}\nClosed By: ${msg.author.tag} (${msg.author.id})\nReason: ${reason}`];
    const arr = [];
    msgs.forEach(m => arr.push(`[${m.createdAt.toUTCString()}] ${m.author.tag}(${m.author.id}): ${m.content}${m.attachments.length > 0 ? `\n\nAttachments: ${m.attachments.map(a => a.url).join('\n')}` : ''}${m.embeds.length > 0 ? `\n\nEmbed: ${m.embeds.map(e => `${e.title}\n${e.description}\n${e.fields.map(f => `${f.name} : ${f.value}`).join('\n')}`).join('\n')}` : ''}`));
    arr.sort();
    const log = reas.concat(arr);
    const haste = this.client.util.haste(log.join('\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'));
    tickets = this.client.util.removeItemOnce(tickets, ticket);
    ticket.closed = true;
    ticket.closedById = msg.author.id;
    ticket.closeReason = reason;
    tickets = tickets.concat(ticket);
    await this.client.settings.set(msg.guild.id, 'tickets', tickets);
    await logChannel.send(`Ticket closed by ${msg.author.tag} (${msg.author.id})\n**Info**:\n${msg.channel.topic}\n**Question:** ${ticket.reason}\n**Reason**: ${reason}\n**Log**: ${haste}`);
    return await msg.channel.delete(reason).catch();
  }
};