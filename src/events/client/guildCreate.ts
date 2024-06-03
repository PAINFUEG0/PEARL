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

const event: keyof Events = 'guildCreate';

export default class GuildCreateEvent implements Event<typeof event> {
  name = event;

  async execute(client: ExtendedClient, guild: Guild) {
    if (!guild) return;

    const owner = await guild.fetchOwner({ force: true }).catch(() => null);

    const logs = await guild.fetchAuditLogs({ type: 28 }).catch(() => null);
    const adder =
      logs?.entries.filter((entry) => entry.target?.id === client.user!.id).first()?.executor ||
      null;

    const obj = {
      embeds: [
        client
          .embed('Green')
          .title(`Thank you for choosing ${client.user!.username}!`)
          .desc(
            `${client.emoji.check} \`${
              client.user!.username + `\` has been successfully added to \`${guild.name}\`.`
            }\n\n` +
              `${client.emoji.info} You can report any issues at my **[Support Server](${client.config.links.support})** or you can use \`${client.prefix}report\`. ` +
              `You can also reach out to my **[Developers](${client.config.links.support})** if you want to know more about me.`,
          ),
      ],
      components: [
        new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
          client.button().link('Support Server', `${client.config.links.support}`),
        ),
      ],
    };

    await owner?.send(obj).catch(() => null);
    if (adder?.id !== owner?.id) await adder?.send(obj).catch(() => null);

    await client.webhooks.guildLogs.send({
      username: `GuildCreate-logs`,
      avatarURL: `${client.user?.displayAvatarURL()}`,
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.check} \`Joined a guild (${moment().tz('Asia/Kolkata')})\`\n\n` +
              `${client.emoji.info} \`${guild.name}\`\n` +
              `${client.emoji.info} \`GuildId : ${guild.id}\`\n` +
              `${client.emoji.info} \`Owner : ${owner?.user.displayName}\`\n` +
              `${client.emoji.info} \`OwnerId : ${guild.ownerId}\`\n` +
              `${client.emoji.info} \`Adder : ${adder?.username}\`\n` +
              `${client.emoji.info} \`AdderId : ${adder?.id}\`\n` +
              `${client.emoji.info} \`Membercount : ${guild.memberCount}\`\n`,
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
