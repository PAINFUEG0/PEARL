/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { ActionRowBuilder } from 'discord.js';
import { Event } from '../../classes/abstract/event.js';
import { ExtendedClient } from '../../classes/client.js';
import { Events } from '../../interfaces/eventsInterface.js';
import { Context } from '../../interfaces/contextInterface.js';
import { ExtendedButtonBuilder } from '../../classes/button.js';

const event: keyof Events = 'underMaintenance';

export default class UnderMaintainanceEvent implements Event<typeof event> {
  name = event;
  async execute(client: ExtendedClient, ctx: Context) {
    await ctx.reply({
      embeds: [
        client
          .embed('Red')
          .desc(
            `${client.emoji.cross} \`This action's unavailable for now.\`\n` +
              `${client.emoji.warn} \`- - - - Maintenance Break - - - -.\`\n` +
              `${client.emoji.info} \`Sorry for any/all inconvenience/s.\`\n` +
              `${client.emoji.info} \`All services will be resumed soon.\`\n`,
          ),
      ],
      components: [
        new ActionRowBuilder<ExtendedButtonBuilder>().addComponents([
          client.button().link('⠀⠀⠀⠀⠀⠀⠀⠀⠀ Support Server ⠀⠀⠀⠀⠀⠀⠀', client.config.links.support),
        ]),
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
