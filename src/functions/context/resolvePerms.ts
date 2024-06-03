/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';

export const resolvePerms = {
  basic: async (ctx: Context) => {
    return ctx.guild.members
      .me!.permissionsIn(ctx.channel)
      ?.has(['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'EmbedLinks'], true);
  },

  bot: async (ctx: Context, command: Command) => {
    const missingBotPermissions = ctx.guild.members
      .me!.permissionsIn(ctx.channel)
      .missing([...command.botPerms], true);

    if (missingBotPermissions?.length) {
      await ctx.reply({
        embeds: [
          ctx.client
            .embed('Yellow')
            .desc(
              `${ctx.client.emoji.warn} \`I need ${missingBotPermissions.join(
                ', ',
              )} permission(s) to execute the command ${command.name}.\``,
            ),
        ],
      });
      return false;
    }
    return true;
  },

  user: async (ctx: Context, command: Command, botAdmin: boolean) => {
    const missingUserPermissions = ctx.member
      ?.permissionsIn(ctx.channel)
      .missing([...command.userPerms], true);

    if (!botAdmin && missingUserPermissions?.length) {
      await ctx.reply({
        embeds: [
          ctx.client
            .embed('Yellow')
            .desc(
              `${ctx.client.emoji.warn} \`You need ${missingUserPermissions.join(
                ', ',
              )} permission(s) to execute the command ${command.name}.\``,
            ),
        ],
      });
      return false;
    }

    return true;
  },
};

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
