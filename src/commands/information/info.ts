/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { ExtendedClient } from '../../classes/client.js';
import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';

export default class InfoCommand extends Command {
  override aliases = ['bi'];
  description = 'Shows details about me';

  async execute(client: ExtendedClient, ctx: Context) {
    await ctx.reply({
      embeds: [
        client
          .embed()
          .desc(
            '```\n' +
              '┌────────────────────────────────────┐\n' +
              '│          /** Bot-Info */           │\n' +
              '├────────────────────────────────────┤\n' +
              '│ • Pearl v1.0.0        ┌──────────┐ │\n' +
              '│ • Open - sourced      │ 21112002 │ │\n' +
              '│ • A music bot ig      │ 13032022 │ │\n' +
              '│ • Owner not_a_coder   │ 23122022 │ │\n' +
              '│ • © 24 1sT-Services   └──────────┘ │\n' +
              '├────────────────────────────────────┤\n' +
              '│ • Nerdy Stats                      │\n' +
              '│     ├ Runtime         -  node@lts  │\n' +
              '│     ├ NodeJs          -  @ 20.x.x  │\n' +
              '│     └ Discord.js      -  @ 14.x.x  │\n' +
              '├────────────────────────────────────┤\n' +
              '│ • Why was I made ?                 │\n' +
              '│     └ Who knows . . . . . . . .    │\n' +
              '│                                    │\n' +
              '│ • My other projects                │\n' +
              '│     └ codes-for.fun/painfuego      │\n' +
              '├────────────────────────────────────┤\n' +
              '│Made and maintained by -1st-Services│\n' +
              '└────────────────────────────────────┘\n' +
              '\n```',
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
