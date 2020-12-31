const { Command } = require('discord-akairo');
class PingCommand extends Command {
  constructor() {
    super('ping', {
      category: 'Utility',
      aliases: ['ping', 'ut'],
      description: {
        content: 'Get the ping and uptime'
      }
    });
  }

  /**
     *
     * @param {Message} msg
     */
  async exec(msg) {
    const sent = await msg.util.reply('📶 Pinging...');
    const timeDiff = (sent.editedTimestamp || sent.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp);
    const uptime = this.client.util.msToTime(this.client.uptime);
    sent.edit([
      '📶 Pong!',
      `🔂 **Response Time**: ${timeDiff} ms`,
      `💓 **API Latency**: ${Math.round(this.client.ws.ping)} ms`,
      `🕑 **Uptime**: ${uptime}`
    ]);
  }
}


module.exports = PingCommand;