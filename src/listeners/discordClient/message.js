const { Listener } = require('discord-akairo'), ignore = [];
class messageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message'
    });
  }

  async exec(msg) {
    if (msg.author.bot) return;
    const prefix = await this.client.commandHandler.prefix(msg);
    if (msg.content === `<@!${this.client.user.id}>`) return msg.reply(`My prefix is \`${prefix}\``);

    // Tickets
    if (!msg.guild && !ignore.includes(msg.author.id)) {
      const typeResolver2 = this.client.commandHandler.resolver.type('ticket');
      const tickets = await typeResolver2(msg, msg.author.id);
      if (!tickets || !tickets.length) return;
      const invite = await msg.client.fetchInvite(msg.content).catch(() => msg.react('❌'));
      if (!invite) return;
      ignore.push(msg.author.id);
      if (tickets.length === 1) return await this.handleInv(tickets[0], msg, invite);
      else {
        const guilds = [];
        for (const t of tickets) {
          const guild = this.client.guilds.cache.get(t.guild);
          guilds.push({ name: guild.name, id: guild.id });
        }
        await msg.channel.send('You have tickets open in multiple servers, please select one:\n'
          + guilds.map((g, i) => `\`${i + 1}\`: **${g.name}**`).join('\n'));

        const filter = res => parseInt(res) > 0 && parseInt(res) <= guilds.length;
        msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
          .then(async col => {
            const t = tickets.find(t => t.guild === guilds[parseInt(col.first()) - 1].id);
            return await this.handleInv(t, col.first(), invite);
          })
          .catch(() => {
            msg.channel.send('❌ Timed out. Send invite again.');
          });

      }
    }

    return;
  }

  async handleInv(ticket, msg, invite) {
    var index = ignore.indexOf(msg.author.id);
    if (index > -1) {
      ignore.splice(index, 1);
    }
    const chnl = this.client.channels.cache.get(ticket.channel);
    await chnl.send(`${msg.author}, invite received: ${invite.url}`);
    const oldTicket = ticket;
    ticket.invite = invite.code;
    await this.client.ticket.edit(this.client, msg.author.id, oldTicket, ticket);
    return msg.react('✅');
  }
}

module.exports = messageListener;