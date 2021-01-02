const { Command } = require('discord-akairo');
class uqrCommand extends Command {
  constructor() {
    super('uq', {
      category: 'Quick Response',
      aliases: ['useQuickResponse', 'uqr', 'uq'],
      description: {
        content: 'Use a quick response',
        note: 'It can also be used as `.<name/alias>` e.g., `.cool`',
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
            optional: true
          }
        }
      ]
    });
  }

  async condition(msg, cQr) {
    if(cQr) return cQr;
    if(!msg.guild || !msg.content.startsWith('.')) return false;
    const name = msg.content.slice(1);
    const typeResolver = this.client.commandHandler.resolver.type('quickResponse');
    const qr = await typeResolver(msg, name);
    if(!qr) return false;
    return qr;
  }

  async exec(msg, { qr }) {
    qr = await this.condition(msg, qr);
    if(!qr) return this.handler.findCommand('lq').exec(msg);
    msg.delete();
    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(w => w.name === 'Support QR');
    if(!webhook) webhook = await msg.channel.createWebhook('Support QR');
    return webhook.send(qr.response, { username: msg.author.username, avatarURL: msg.author.displayAvatarURL() });
  }
}


module.exports = uqrCommand;