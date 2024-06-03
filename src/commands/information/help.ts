/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import {
  ActionRowBuilder,
  CollectedInteraction,
  StringSelectMenuBuilder,
  AnySelectMenuInteraction,
} from 'discord.js';
import { filter } from '../../utils/filter.js';
import { ExtendedClient } from '../../classes/client.js';
import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';

export default class HelpCommand extends Command {
  override aliases = ['h'];
  description = 'Shows my help menu';

  async execute(client: ExtendedClient, ctx: Context) {
    const allCommands = client.commands.reduce(
      (acc, cmd: Command) => {
        if (cmd.category === 'owner') return acc;
        acc[cmd.category] = acc[cmd.category] || [];
        acc[cmd.category].push({
          name: cmd.name,
          description: `${
            (cmd.description?.length > 25
              ? cmd.description?.substring(0, 22) + '...'
              : cmd.description) || 'No description available'
          }`,
        });
        return acc;
      },
      {} as {
        [category: string]: {
          [commandPropertyKey: string]: string;
        }[];
      },
    );

    const categories = client.categories
      .filter((category) => category !== 'owner')
      .sort((b, a) => b.length - a.length);

    const embed = client
      .embed()
      .desc(
        `${client.emoji.info} \`${`My global prefix is ${client.prefix} ( Changable ).`.padEnd(
          48,
          ' ',
        )}\`\n` +
          `${client.emoji.info} \`${'Made and maintained by 1sT-Services.'.padEnd(48, ' ')}\`\n` +
          `${client.emoji.info} \`${'Select an option below to view cmds.'.padEnd(48, ' ')}\`\n`,
      )
      .img(
        'https://media.discordapp.net/attachments/1210593301552697396/1232750652648722632/image.png?ex=664ae4c2&is=66499342&hm=6106da966480b9fa8951a2c2d69c15686022fe95ce5f24a818142e56413827d6&=&format=png',
      )
      .setFooter({
        text: 'By ━● 1sT-Services | Use (cmd -h) for command info',
      });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('menu')
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder('Select category to view commands')
      .addOptions([
        {
          label: 'Go to homepage',
          value: 'home',
          emoji: client.emoji.info,
        },
      ]);

    const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    categories.forEach((category) => {
      menu.addOptions({
        label: category.charAt(0).toUpperCase() + category.slice(1) + ' commands',
        value: category,
        emoji: client.emoji.info,
      });
    });

    menu.addOptions([
      {
        label: 'Show all commands',
        value: 'all',
        emoji: client.emoji.info,
      },
    ]);

    const reply = await ctx.reply({
      embeds: [embed],
      components: [selectMenu],
    });

    if (!reply) return;

    const collector = reply.createMessageComponentCollector({
      time: 60000,
      filter: async (interaction: CollectedInteraction) => await filter(interaction, ctx),
    });

    collector.on('collect', async (interaction: AnySelectMenuInteraction) => {
      await interaction.deferUpdate().catch(() => null);

      const category = interaction.values[0];

      switch (category) {
        case 'home':
          await reply.edit({
            embeds: [embed],
          });
          break;

        case 'all':
          await reply.edit({
            embeds: [
              client
                .embed()
                .desc(
                  Object.entries(allCommands)
                    .sort((b, a) => b[0].length - a[0].length)
                    .map((entry) => {
                      const categoryName = entry[0];
                      const commands = entry[1].map((cmd) => `\`${cmd.name}\``).join(', ');
                      return `${client.emoji.check} **\`${
                        categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
                      } commands\`**\n${commands}`;
                    })
                    .join('\n\n'),
                )
                .setFooter({
                  text: 'Developed and maintained By ━● 1sT-Servicesㅤ ㅤ ㅤ ㅤ ㅤㅤㅤㅤㅤㅤ',
                }),
            ],
          });
          break;

        default:
          await reply.edit({
            embeds: [
              client
                .embed()
                .title(
                  `${client.emoji.check} ${
                    category.charAt(0).toUpperCase() + category.slice(1)
                  } commands`,
                )
                .desc(
                  allCommands[category]
                    ?.map(
                      (cmd) =>
                        `${client.emoji.info} **\`${cmd.name.padEnd(
                          11,
                          ' ',
                        )} - \`**\`${cmd.description.padEnd(37, ' ')}\``,
                    )
                    .join('\n') ||
                    `${client.emoji.warn} **\`${'No Commands Available'.padEnd(48, ' ')}\`**`,
                )
                .footer({
                  text: 'Developed and maintained By ━● 1sT-Servicesㅤ ㅤ ㅤ ㅤ ㅤㅤㅤㅤㅤㅤ',
                }),
            ],
          });
          break;
      }
    });

    collector.on('end', async () => {
      await reply.edit({ components: [] }).catch(() => null);
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
