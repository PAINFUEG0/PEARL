/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import moment from 'moment-timezone';
import { ActionRowBuilder, Guild } from 'discord.js';
import { Event } from '../../classes/abstract/event.js';
import { ExtendedClient } from '../../classes/client.js';
import { Events } from '../../interfaces/eventsInterface.js';
import { ExtendedButtonBuilder } from '../../classes/button.js';

const event: keyof Events = 'guildDelete';

export default class GuildDeleteEvent implements Event<typeof event> {
  name = event;

  execute = async (client: ExtendedClient, guild: Guild) => {
    if (!guild?.name) return;

    const owner = await client.users.fetch(guild.ownerId, { force: true }).catch(() => null);

    await owner
      ?.send({
        embeds: [
          client
            .embed('Yellow')
            .title(`Oops! ${client.user!.username} was removed!`)
            .desc(
              `${client.emoji.warn} \`${client.user!.username}\` was just removed from \`${
                guild.name
              }\`.\n\n` +
                `${client.emoji.info} Sorry for all and any of the bad experience/(s) you had with me!\n\n` +
                `${client.emoji.info} Please leave a feedback or report any issues you had at my **[Support Server](${client.config.links.support})** so that it can be fixed / worked on as soon as possible.`,
            ),
        ],
        components: [
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            client.button().link('Support Server', `${client.config.links.support}`),
            client.button().link('Add me back', `${client.invite.required()}`),
          ),
        ],
      })
      .catch(() => null);

    await client.db.prefix.guild.delete(guild.id);

    await client.webhooks.guildLogs.send({
      username: `GuildLeave-logs`,
      avatarURL: `${client.user?.displayAvatarURL()}`,
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.warn} \`Left a guild (${moment().tz('Asia/Kolkata')})\`\n\n` +
              `${client.emoji.info} \`${guild.name}\`\n` +
              `${client.emoji.info} \`GuildId : ${guild.id}\`\n` +
              `${client.emoji.info} \`Owner : ${owner?.displayName}\`\n` +
              `${client.emoji.info} \`OwnerId : ${guild.ownerId}\`\n` +
              `${client.emoji.info} \`Membercount : ${guild.memberCount}\`\n`,
          ),
      ],
    });
  };
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
