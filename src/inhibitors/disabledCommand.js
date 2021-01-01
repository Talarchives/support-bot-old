const { Inhibitor } = require('discord-akairo');

class guildInhibitor extends Inhibitor {
  constructor() {
    super('cmdno', {
      reason: 'commandDisabled'
    });
  }

  async exec(msg, cmd) {
    if(!msg.guild) return false;
    const disabledCommands = await this.client.settings.get(msg.guild.id, 'disabledCommands', []);
    return disabledCommands.includes(cmd.aliases[0]);
  }
}

module.exports = guildInhibitor;