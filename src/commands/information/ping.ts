/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { ExtendedClient } from '../../classes/client.js';
import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';

export default class PingCommand extends Command {
  override aliases = ['latency', 'pong'];
  description = 'Shows my latency stats';

  async execute(client: ExtendedClient, ctx: Context) {
    const msg = await ctx.reply({
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.timer} \`Socket latency   - ${'------'.padStart(7, ' ')} ms\` \n` +
              `${client.emoji.timer} \`Message latency  - ${'------'.padStart(7, ' ')} ms\` \n` +
              `${client.emoji.timer} \`Database latency - ${'------'.padStart(7, ' ')} ms\``,
          ),
      ],
    });

    const msgLatency = msg.createdTimestamp - ctx.createdTimestamp;
    const start = performance.now();
    await Promise.all([
      client.db.blacklist.set('test', true),
      client.db.blacklist.get('test'),
      client.db.blacklist.delete('test'),
    ]);
    const dbLatency = performance.now() - start;

    await msg?.edit({
      content: '',
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.info} \`Socket latency   - ${client.ws.ping
              .toFixed(2)
              .padStart(7, ' ')} ms\` \n` +
              `${client.emoji.info} \`Message latency  - ${msgLatency
                .toFixed(2)
                .padStart(7, ' ')} ms\` \n` +
              `${client.emoji.info} \`Database latency - ${dbLatency
                .toFixed(2)
                .padStart(7, ' ')} ms\``,
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
