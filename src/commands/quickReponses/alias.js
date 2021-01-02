const { Command } = require('discord-akairo');
class eqraCommand extends Command {
  constructor() {
    super('eqra', {
      category: 'Quick Response',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['editQuickResponseAlias', 'eqra', 'eqa'],
      description: {
        content: 'Edit a quick response',
        usage: '<name> <addOrRemove> <alias>',
        examples: [
          'cool remove nice',
          'cool add noice'
        ]
      }
    });
  }

  *args() {
    const qr = yield {
      type: 'quickResponse',
      prompt: {
        start: 'Enter the quick response name.',
        retry: '❌ No quick response with that name exists. Please try again'
      }
    };
    const addOrRemove = yield {
      type: [
        ['add', 'a', 'create', 'c'],
        ['remove', 'r', 'delete', 'd']
      ],
      prompt: {
        start: 'Do you want to `add` or `remove` an alias?',
        retry: '❌ You only choose from `add` or `remove`'
      }
    };
    const alias = yield {
      type: async (msg, str) => {
        if (!str) return null;
        str = str.toLowerCase();
        const incl = qr.aliases.includes(str);
        return addOrRemove === 'add' ?
          (incl ? null : str) :
          (incl ? str : null);
      },
      prompt: {
        start: `Enter an alias to ${addOrRemove}`,
        retry: () => {
          return addOrRemove === 'add' ?
            '❌ A quick response with that name or alias already exists. Please try again.' :
            '❌ This quick response does not have this alias';
        }
      }
    };
    return { qr, addOrRemove, alias };
  }

  async exec(msg, { qr, addOrRemove, alias }) {
    if (qr.aliases.length === 1 && addOrRemove === 'remove') return msg.reply('❌ Failed to remove alias. A quick response must have at least 1 alias.');
    const embed = msg.client.util.embed()
      .setColor(process.env.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .addFields([
        { name: 'Name', value: qr.name, inline: true },
        { name: 'Edited Aliases', value: makeStr(qr, alias, addOrRemove), inline: true },
        { name: 'Response', value: qr.response }
      ]);
    let qrs = await this.client.settings.get(msg.guild.id, 'quickResponse', []);
    qrs = this.client.util.removeItemOnce(qrs, qr);
    qr.aliases = addOrRemove === 'add' ? qr.aliases.concat(alias) :
      this.client.util.removeItemOnce(qr.aliases, alias);
    await this.client.settings.set(msg.guild.id, 'quickResponse', qrs);

    msg.reply(`✅ Alias ${addOrRemove === 'add' ? 'added' : 'removed'} succesfully!`, embed);
  }
}

function makeStr(qr, alias, addOrRemove) {
  const str1 = qr.aliases.map(a => a === alias ? `~~**\`${a}\`**~~` : `\`${a}\``).join(', '),
    str2 = addOrRemove === 'add' ? `, ${string(alias, addOrRemove)}` : '';
  return str1 + str2;
}

function string(str, addOrRemove) {
  return addOrRemove === 'add' ?
    `__**\`${str}\`**__` :
    `~~**\`${str}\`**~~`;
}

module.exports = eqraCommand;