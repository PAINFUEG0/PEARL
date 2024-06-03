/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { Event } from '../../classes/abstract/event.js';
import { ExtendedClient } from '../../classes/client.js';
import { Command } from '../../classes/abstract/command.js';
import { Events } from '../../interfaces/eventsInterface.js';
import { Context } from '../../interfaces/contextInterface.js';

const event: keyof Events = 'infoRequested';

export default class InfoRequestedEvent implements Event<typeof event> {
  name = event;

  async execute(client: ExtendedClient, ctx: Context, command: Command) {
    const data = {
      name: `Name : ${command.name}`.padEnd(35, ' '),
      aliases: `Aliases : ${
        command.aliases.length ? `${command.aliases.join(', ')}` : 'No aliases found'
      }`.padEnd(35, ' '),
      description: `Desc : ${
        command.description?.length > 23
          ? command.description?.substring(0, 20) + '...'
          : command.description
      }`.padEnd(35, ' '),
      usage: `Usage : ${client.prefix}${command.name} ${command.usage}`.padEnd(35, ' '),
    };

    await ctx.reply({
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.check} \`Command info :\`\n\n` +
              `${client.emoji.info} \`${data.name}\`\n` +
              `${client.emoji.info} \`${data.aliases}\`\n` +
              `${client.emoji.info} \`${data.usage}\`\n` +
              `${client.emoji.info} \`${data.description}\`\n`,
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