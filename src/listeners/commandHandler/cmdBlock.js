const { Listener } = require('discord-akairo');
class cmdErrorListener extends Listener {
  constructor() {
    super('cmdBlocked', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'commandBlocked'
    });
  }
  /**
     *
     * @param {Message} msg
     * @param {Command} command
     * @param {string} reason
     */
  exec(msg, _, reason) {
    const strings = {
      'guild': '❌ This command can only be used in a server.',
      'guildBanned': '❌ This server is banned.'
    };
    return msg.reply(strings[reason]).catch();
  }
}

module.exports = cmdErrorListener;