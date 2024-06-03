/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { config } from 'dotenv';
import { log } from './logger.js';
import { existsSync } from 'node:fs';
import { question } from 'readline-sync';
import { fileURLToPath } from 'node:url';
import { bind } from './functions/bind.js';
import { configuration } from './config.js';
import { dirname, resolve } from 'node:path';
import { availableParallelism } from 'node:os';
import { ClusterManager } from 'discord-hybrid-sharding';

const __dirname = dirname(fileURLToPath(import.meta.url));

config();

const [configFilePath, encryptedFilePath] = ['./vow.json', './binding.eps'];

const __main__ = async () => {
  const [configFile, encryptedFile] = [existsSync(configFilePath), existsSync(encryptedFilePath)];

  if (!configFile && !encryptedFile) {
    log(`Neither ${configFilePath} nor ${encryptedFilePath} found.`, 'error');
    log(`Make and fill ${configFilePath} and re-run.`);
    process.exit(1);
  }

  if (configFile && !encryptedFile) {
    await bind(configFilePath, encryptedFilePath);
    process.exit(1);
  }

  if (configFile && encryptedFile) {
    log(
      `Found existing ${encryptedFilePath} as well as ${configFilePath}.\n` +
        `\t> Enter '1' to generate new ${encryptedFilePath} \n` +
        "\t> Press 'Enter' to continue with existing",
    );
    const choice = question('Enter your choice :');

    if (choice === '1') {
      await bind(configFilePath, encryptedFilePath);
      process.exit(1);
    }
  }

  if (!process.env.IV?.length) process.env.IV = question('Enter Initialization Vector (IV) : ');
  if (!process.env.KEY?.length) process.env.KEY = question('Enter Decryption key (Key) : ');

  console.clear();

  new ClusterManager(resolve(__dirname, './pearl.js'), {
    respawn: true,
    mode: 'worker',
    totalShards: 'auto',
    token: configuration().token,
    totalClusters: availableParallelism(),
    restarts: { max: 10, interval: 10000 },
  })
    .on('debug', (data) => log(data))
    .spawn({ timeout: -1 });
};

__main__();

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
