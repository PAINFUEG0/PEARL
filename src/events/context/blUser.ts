/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import moment from 'moment-timezone';
import { ActionRowBuilder } from 'discord.js';
import { Event } from '../../classes/abstract/event.js';
import { ExtendedClient } from '../../classes/client.js';
import { Events } from '../../interfaces/eventsInterface.js';
import { Context } from '../../interfaces/contextInterface.js';
import { ExtendedButtonBuilder } from '../../classes/button.js';

const event: keyof Events = 'blUser';

export default class BlacklistUserEvent implements Event<typeof event> {
  name = event;

  async execute(client: ExtendedClient, ctx: Context) {
    const replyObject = {
      embeds: [
        client
          .embed('#000000')
          .desc(
            `**Dear ${ctx.author},**\n\n` +
              `${client.emoji.bl} \`You have been flagged and blacklisted by anti-spam.!\`\n` +
              `${client.emoji.info} \`Open a ticket @ my \`**[\`Support Server\`](${client.config.links.support})**\` for further info.\``,
          ),
      ],
      components: [
        new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
          client.button().link('Support Server', client.config.links.support),
        ),
      ],
    };
    await ctx.react(client.emoji.bl, {
      content:
        '**You have been flagged and blacklisted by my anti-spam !!!!!**\n' +
        'Check your DMs for more information.',
    });
    await ctx.author.send(replyObject).catch(() => null);

    await client.webhooks.blLogs.send({
      username: `Auto-blacklist-logs`,
      avatarURL: `${client.user?.displayAvatarURL()}`,
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.bl} \`Blacklisted an user (${moment().tz('Asia/Kolkata')})\`\n\n` +
              `${client.emoji.info} \`${ctx.author}\`\n` +
              `${client.emoji.info} \`UserId : ${ctx.author.id}\`\n` +
              `${client.emoji.info} \`Guild : ${ctx.guild}\`\n` +
              `${client.emoji.info} \`GuildId : ${ctx.guild.id}\`\n` +
              `${client.emoji.info} \`Channel : ${ctx.channel}\`\n` +
              `${client.emoji.info} \`ChannelId : ${ctx.channel.id}\`\n`,
          ),
      ],
    });
  }
}

/** @Code-style: Google ( https://google.github.io/styleguide/jsguide.html ) */

/** @License Overview:
 *
 * License - CC BY-NC-SA 4.0
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * This license grants permission for others to utilize, share, and adapt the work for non-commercial purposes.
 * In compliance with the license terms, users are required to attribute the original creator, release any derivative works under the same license, and indicate if changes were made.
  Widely adopted for creative works, it fosters collaboration while ensuring that content remains open and freely accessible for non-commercial use.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/ or send a letter to Creative Commons,
  PO Box 1866, Mountain View, CA 94042, USA.
 */
