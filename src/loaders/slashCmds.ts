/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ExtendedClient } from '../classes/client.js';
import { SlashCommandBuilder, REST } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Command } from '../classes/abstract/command.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const deploySlashCommands = async (client: ExtendedClient) => {
  const slashCommands: SlashCommandBuilder[] = [];

  const rest = new REST().setToken(client.config.token);

  if (process.env.SLASH && process.env.SLASH === 'NO-REFRESH') {
    return client.log(
      "Slash commands refreshing disabled at perocess.env.SLASH = 'No-REFRESH'",
      'warn',
    );
  }

  if (process.env.SLASH && process.env.SLASH === 'DISABLED') {
    await rest.put(`/applications/${client.user!.id}/commands`, {
      body: [],
    });

    return client.log("Slash commands disabled at perocess.env.SLASH = 'DISABLED'", 'warn');
  }

  client.log('Slash commands refreshing started');

  if (process.env.SLASH && process.env.SLASH === 'DISABLED') {
    return client.log(
      "Slash commands deployment disabled at perocess.env.SLASH = 'DISABLED'",
      'warn',
    );
  }

  const categories = await readdir(resolve(__dirname, '../commands'));

  for (const category of categories) {
    const commandFiles = await readdir(resolve(__dirname, '../commands', category));

    for (const file of commandFiles) {
      if (!file.endsWith('.js')) continue;
      const fileUrl = pathToFileURL(resolve(__dirname, '../commands', category, file)).href;
      const command = new (await import(fileUrl)).default() as Command;

      if (!command.slash) continue;

      const slash = new SlashCommandBuilder()
        .setName(file.split('.')[0])
        .setDescription(command.description);

      if (command.options.length) {
        for (const op of command.options) {
          switch (op.opType) {
            case 'boolean':
              slash.addBooleanOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                return option;
              });
              break;

            case 'user':
              slash.addUserOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                return option;
              });
              break;

            case 'channel':
              slash.addChannelOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                return option;
              });
              break;

            case 'role':
              slash.addRoleOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                return option;
              });
              break;

            case 'attachment':
              slash.addAttachmentOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                return option;
              });
              break;

            case 'string':
              slash.addStringOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                if (op.choices) option.addChoices(...op.choices);
                return option;
              });
              break;

            case 'number':
              slash.addIntegerOption((option) => {
                option.setName(op.name).setDescription(op.description).setRequired(op.required);
                return option;
              });
              break;
          }
        }
      }
      slashCommands.push(slash);
    }
  }
  await rest.put(`/applications/${client.user!.id}/commands`, {
    body: slashCommands,
  });
  client.log(`Loaded ${slashCommands.length} slash commands`, 'success');
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
