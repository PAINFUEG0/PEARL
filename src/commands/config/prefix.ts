/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { filter } from '../../utils/filter.js';
import { ExtendedClient } from '../../classes/client.js';
import { Args } from '../../interfaces/argsInterface.js';
import { Context } from '../../interfaces/contextInterface.js';
import { ExtendedButtonBuilder } from '../../classes/button.js';
import { Command, options } from '../../classes/abstract/command.js';
import { Message, ActionRowBuilder, ButtonInteraction, CollectedInteraction } from 'discord.js';

export default class PrefixCommand extends Command {
  override usage = '<set/reset> [prefix]';
  description = 'Set/reset prefix';

  override options: options[] = [
    {
      name: 'action',
      opType: 'string',
      description: 'set / rem',
      choices: [
        { name: 'set', value: 'set' },
        { name: 'reset', value: 'reset' },
      ],
      required: false,
    },
    {
      name: 'prefix',
      opType: 'string',
      description: 'prefix',
      required: false,
    },
  ];

  async execute(client: ExtendedClient, ctx: Context, args: Args) {
    let task = '';
    let prefix = '';
    const [guildPrefix, userPrefix] = await Promise.all([
      client.db.prefix.guild.get(ctx.guild.id) as Promise<string | null>,
      client.db.prefix.user.get(ctx.member.id) as Promise<string | null>,
    ]);

    for (let arg of args) {
      arg = arg.toLowerCase();
      if (arg === 'set' || arg === 'reset') {
        task = arg;
        continue;
      }
      prefix = arg;
    }

    if (!task) {
      return await ctx.reply({
        embeds: [
          client
            .embed()
            .desc(
              `${client.emoji.info} \`Global prefix : ${client.prefix.padStart(5, ' ')}\`\n` +
                `${client.emoji.info} \`User prefix   : ${
                  userPrefix?.padStart(5, ' ') || '[N/A]'.padStart(5, ' ')
                }\`\n` +
                `${client.emoji.info} \`Guild prefix  : ${
                  guildPrefix?.padStart(5, ' ') || '[N/A]'.padStart(5, ' ')
                }\``,
            ),
        ],
      });
    }

    const manager = ctx.member.permissions.has('ManageGuild', true) ? true : false;

    const setPrefixButtons = [
      client.button().secondary('set_user', 'User', undefined),
      client.button().secondary('set_guild', 'Guild', undefined, !manager),
      client.button().danger('cancel', 'Cancel'),
    ];

    const resetPrefixButtons = [
      client.button().secondary('reset_user', 'User', undefined, userPrefix ? false : true),
      client
        .button()
        .secondary('reset_guild', 'Guild', undefined, guildPrefix && manager ? false : true),
      client.button().danger('cancel', 'Cancel'),
    ];

    let reply: Message | undefined;

    switch (task) {
      case 'set':
        if (prefix === '' || prefix.length <= 0 || prefix.length > 5)
          return await ctx.reply({
            embeds: [
              client
                .embed('Red')
                .desc(
                  `${client.emoji.cross} \`Prefix's length must be greater 0 and less than or equal to 5.\``,
                ),
            ],
          });
        reply = await ctx.reply({
          embeds: [
            client
              .embed()
              .desc(
                `${client.emoji.info} \`Select an option below for which the prefix will be set to ${prefix}.\`\n` +
                  (manager
                    ? ''
                    : `${client.emoji.warn} \`You need "Manage_Guild" permissions to re-/set guild prefix.\`\n`),
              ),
          ],
          components: [
            new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(setPrefixButtons),
          ],
        });
        break;

      case 'reset':
        prefix = client.prefix;
        reply = await ctx.reply({
          embeds: [
            client
              .embed()
              .desc(
                (!(guildPrefix || userPrefix)
                  ? `${client.emoji.warn} \`It is not possible to reset something that has not been set..\`\n`
                  : `${client.emoji.info} \`Select an option below for which the prefix will be set to ${prefix}.\`\n`) +
                  (manager
                    ? ''
                    : `${client.emoji.warn} \`You need "Manage_Guild" permissions to re-/set guild prefix.\`\n`),
              ),
          ],
          components: !(guildPrefix || userPrefix)
            ? []
            : [new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(resetPrefixButtons)],
        });
        break;
    }

    const collector = reply!.createMessageComponentCollector({
      time: 20000,
      filter: async (interaction: CollectedInteraction) => await filter(interaction, ctx),
    });

    collector.on('collect', async (interaction: ButtonInteraction) => {
      await interaction.deferUpdate().catch(() => null);

      if (interaction.customId === 'cancel') {
        await reply?.edit({
          embeds: [
            client.embed().desc(`${client.emoji.warn} \`Prefix modification cancelled by user.\``),
          ],
          components: [],
        });
        collector.stop();
        return;
      }

      const [action, prefixType] = interaction.customId.split('_');

      switch (action) {
        case 'set':
          switch (prefixType) {
            case 'user':
              await client.db.prefix.user.set(ctx.member.id, prefix);
              break;
            case 'guild':
              await client.db.prefix.guild.set(ctx.guild.id, prefix);
              break;
          }
          break;
        case 'reset':
          switch (prefixType) {
            case 'user':
              await client.db.prefix.user.delete(ctx.member.id);
              break;
            case 'guild':
              await client.db.prefix.guild.delete(ctx.guild.id);
              break;
          }
          break;
      }
      await reply?.edit({
        embeds: [
          client
            .embed()
            .desc(
              `${client.emoji.check} \`Successfully set ${prefixType}-prefix to ${prefix} ${
                action === 'set' ? '(custom)' : '(default)'
              }.\``,
            ),
        ],
        components: [],
      });
    });

    collector.on('end', async (collected, reason) => {
      if (!reply?.components.length) return;
      if (reason === 'time') {
        await reply?.edit({
          embeds: [
            client
              .embed()
              .desc(reply?.embeds[0].description as string)
              .footer({
                text: 'Command timed out !!! Please re-run.',
              }),
          ],
          components: [],
        });
      }
      await reply?.edit({ components: [] }).catch(() => null);
    });
    return;
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
