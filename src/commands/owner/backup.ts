/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { unlink } from 'fs/promises';
import { AttachmentBuilder } from 'discord.js';
import { zipper } from '../../functions/zipper.js';
import { ExtendedClient } from '../../classes/client.js';
import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';
import metadata from '../../metadata.json' with { type: 'json' };

export default class InviteCommand extends Command {
  override aliases = ['backup'];
  description = 'Sends backup-zip to DM';

  async execute(client: ExtendedClient, ctx: Context) {
    const file = `./${metadata.name}_v${metadata.version}.zip`;

    const m = await ctx.reply({
      embeds: [client.embed().desc(`**${client.emoji.timer} | Preparing zip please wait. . .**`)],
    });

    await zipper(file);

    await ctx.author
      .send({
        files: [
          new AttachmentBuilder(file, {
            name: file,
            description: new Date(Date.now()).toDateString(),
          }),
        ],
      })
      .then(async () => {
        await m
          .edit({
            embeds: [
              client.embed().desc(`**${client.emoji.check} | Successfully sent zip to DM**`),
            ],
          })
          .catch(() => {});
      })
      .catch(async (err) => {
        await m
          .edit({
            embeds: [
              client.embed().desc(`**${client.emoji.cross} | Could not send zip to DM**\n${err}`),
            ],
          })
          .catch(() => {});
      });

    await unlink(file);
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
