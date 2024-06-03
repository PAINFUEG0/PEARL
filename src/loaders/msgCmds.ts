/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ExtendedClient } from '../classes/client.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Command } from '../classes/abstract/command.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const loadCommands = async (client: ExtendedClient) => {
  let totalCommandCount = 0;

  const categories = await readdir(resolve(__dirname, '../commands'));

  for (const category of categories) {
    const commandFiles = await readdir(resolve(__dirname, '../commands', category));

    for (const file of commandFiles) {
      if (!file.endsWith('.js')) continue;
      const fileUrl = pathToFileURL(resolve(__dirname, '../commands', category, file)).href;
      const command = new (await import(fileUrl)).default() as Command;

      command.category = category;
      command.name = file.split('.')[0];
      command.aliases.push(file.split('.')[0]);
      command.owner = category === 'owner' ? true : false;

      client.commands.set(command.name, command);

      totalCommandCount++;
    }
  }
  client.log(`Loaded ${totalCommandCount} message commands`, 'success');
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
