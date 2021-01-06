const { Listener } = require('discord-akairo');
class messageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message'
    });
  }

  async exec(msg) {
    if(msg.author.bot) return;
    const prefix = await this.client.commandHandler.prefix(msg);
    if(msg.content === `<@!${this.client.user.id}>`) return msg.reply(`My prefix is \`${prefix}\``);
    const typeResolver2 = this.handler.resolver.type('ticket');
    const ticket = await typeResolver2(msg, msg.author.id);
    if(ticket) {
      const invite = await msg.client.fetchInvite(msg.content).catch(() => msg.react('❌'));
      const chnl = this.client.channels.cache.get(ticket.channel);
      if(!chnl || chnl.deleted) return;
      await chnl.send(msg.author + `, invite received: ${invite.url}`);
      let tickets = await this.client.settings.get(msg.guild.id, 'tickets', []);
      tickets = this.client.util.removeItemOnce(tickets, ticket);
      ticket.invite = invite.code;
      tickets = tickets.concat(ticket);
      await this.client.settings.set(msg.guild.id, 'tickets', tickets);
      return msg.react('✅');
    }
    return ;
  }
}

module.exports = messageListener;