/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { filter } from "./filter.js";
import { ExtendedEmbedBuilder } from "../classes/embed.js";
import { Context } from "../interfaces/contextInterface.js";
import { ExtendedButtonBuilder } from "../classes/button.js";
import { ActionRowBuilder, CollectedInteraction } from "discord.js";

export const paginator = async (ctx: Context, pages: ExtendedEmbedBuilder[]) => {
  const client = ctx.client;

  if (pages.length === 1) {
    await ctx?.reply({
      embeds: [pages[0]],
    });
    return;
  }

  let page = 0;

  const reply = await ctx?.reply({
    embeds: [pages[page]],
    components: [
      new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
        client.button().secondary("back", "Previous"),
        client.button().secondary("home", "Home"),
        client.button().secondary("next", "Next"),
        client.button().danger("end", "Close"),
      ),
    ],
  });

  if (!reply) return;

  const collector = reply.createMessageComponentCollector({
    time: 60000,
    filter: async (interaction: CollectedInteraction) => await filter(interaction, ctx),
  });

  collector.on("collect", async (interaction: CollectedInteraction) => {
    await interaction.deferUpdate().catch(() => null);

    switch (interaction.customId) {
      case "home":
        page = 0;
        break;

      case "back":
        page = page > 0 ? --page : pages.length - 1;
        break;

      case "next":
        page = page + 1 < pages.length ? ++page : 0;
        break;

      case "end":
        collector.stop();
        break;
    }

    await reply.edit({
      embeds: [pages[page]],
    });
  });

  collector.on("end", () => {
    reply
      .edit({
        components: [],
      })
      .catch(() => null);
  });
  return;
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
