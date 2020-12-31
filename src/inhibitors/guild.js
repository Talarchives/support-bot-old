const { Inhibitor } = require('discord-akairo');

class guildInhibitor extends Inhibitor {
  constructor() {
    super('guild', {
      reason: 'guildBanned'
    });
  }

  async exec(msg) {
    if(!msg.guild) return false;
    return await this.client.settings.get(msg.guild.id, 'banned', false);
  }
}

module.exports = guildInhibitor;