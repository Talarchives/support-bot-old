const { Listener } = require('discord-akairo');
class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  async exec() {
    const { presence } = require('../../config.json');
    await this.client.user.setPresence(presence);
    this.client.info('Ready!');
  }
}

module.exports = ReadyListener;