const { Command } = require('discord-akairo');
class tcmdCommand extends Command {
  constructor() {
    super('tcmd', {
      category: 'Settings',
      aliases: ['tcmd'],
      userPermissions: 'MANAGE_MESSAGES',
      channel: 'guild',
      description: {
        content: 'Enable or disable a command / View disabled commands',
        usage: '[command]',
        examples: [
          'ping',
          ''
        ]
      },
      args: [
        {
          id: 'cmd',
          type: 'commandAlias',
          prompt: {
            optional: true,
            retry: 'Please provide a valid command to toggle'
          }
        }
      ]
    });
  }

  async exec(msg, { cmd }) {
    let disabledCommands = await this.client.settings.get(msg.guild.id, 'disabledCommands', []);
    if(!cmd) {
      const embed = this.client.util.embed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setTitle('Disabled Commands')
        .setDescription(disabledCommands.length ? disabledCommands.join('\n') : '❌ No commands disabled!');
      return msg.channel.send(embed);
    }
    if(cmd.aliases[0] === 'tcmd') return msg.reply('❌ You can\'t disable this command.');
    if(disabledCommands.includes(cmd.aliases[0])) {
      disabledCommands = this.client.util.removeItemOnce(disabledCommands, cmd.aliases[0]);
      await this.client.settings.set(msg.guild.id, 'disabledCommands', disabledCommands);
      return msg.reply(`✅ Enabled \`${cmd.aliases[0]}\` command.`);
    } else {
      disabledCommands = disabledCommands.concat(cmd.aliases[0]);
      await this.client.settings.set(msg.guild.id, 'disabledCommands', disabledCommands);
      return msg.reply(`✅ Disabled \`${cmd.aliases[0]}\` command.`);
    }
  }
}

module.exports = tcmdCommand;