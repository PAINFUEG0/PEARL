/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { readdirSync } from 'fs';
import { Methods } from './methods.js';
import { fileURLToPath } from 'node:url';
import { emoji } from '../assets/emoji.js';
import { josh } from '../functions/josh.js';
import { log, LogLevel } from '../logger.js';
import { configuration } from '../config.js';
import { dirname, resolve } from 'node:path';
import { Command } from './abstract/command.js';
import { ExtendedEmbedBuilder } from './embed.js';
import { ExtendedButtonBuilder } from './button.js';
import { OAuth2Scopes } from 'discord-api-types/v10';
import { readyEvent } from '../functions/readyEvent.js';
import { formatBytes, formatDuration } from './methods.js';
import { WebhookClient, ColorResolvable } from 'discord.js';
import { Client as dokdoClient } from '../../dokdo/index.js';
import { WebhookConfig } from '../interfaces/configInterface.js';
import { getInfo, ClusterClient } from 'discord-hybrid-sharding';
import { Client, Partials, Collection, Message } from 'discord.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = configuration();

export class ExtendedClient extends Client {
  constructor() {
    super({
      intents: 3276543,

      failIfNotExists: false,

      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,

      allowedMentions: {
        repliedUser: false,
        parse: ['users', 'roles'],
      },

      sweepers: {
        users: {
          filter: () => (user) => user.id !== this.user!.id,
          interval: parseInt(process.env.SWEEPER_INTERVAL || '3_600'),
        },
        guildMembers: {
          filter: () => (member) => member.id !== this.user!.id,
          interval: parseInt(process.env.SWEEPER_INTERVAL || '3_600'),
        },
      },

      presence: {
        status: 'online',
        activities: [
          {
            type: 4,
            name: `By ━● 1sT-Services | ${config.prefix}help`,
          },
        ],
      },

      partials: [Partials.User, Partials.Channel, Partials.Message, Partials.GuildMember],
    });

    this.on('debug', (data) => this.log(data));
    this.on('ready', async () => await readyEvent(this));
    this.on('messageUpdate', (_, newMessage) => this.emit('messageCreate', newMessage as Message));
  }

  emoji = emoji;
  config = config;
  underMaintenance = false;
  prefix = this.config.prefix;
  owners = this.config.owners;
  admins = this.config.admins;

  dokdo: dokdoClient | null = null;
  cluster = new ClusterClient(this);

  invite = {
    admin: () =>
      this.generateInvite({
        scopes: [OAuth2Scopes.Bot],
        permissions: ['Administrator'],
      }),
    required: () =>
      this.generateInvite({
        scopes: [OAuth2Scopes.Bot],
        permissions: ['Administrator'],
      }),
  };

  db = {
    blacklist: josh('blacklist'),
    prefix: {
      user: josh('prefix/user'),
      guild: josh('prefix/guild'),
    },
    stats: {
      commandsUsed: josh('stats/commandsUsed'),
    },
  };

  get down() {
    return this.underMaintenance;
  }

  set down(value) {
    this.underMaintenance = value;
  }

  connectToGateway() {
    this.login(this.config.token).catch((error) => {
      this.log(error, 'error');
      console.log(error);
      process.exit(1);
    });
    return this;
  }

  categories = readdirSync(resolve(__dirname, '../commands'));

  webhooks = Object.fromEntries(
    Object.entries(this.config.webhooks).map(([hook, url]) => [
      hook as keyof WebhookConfig,
      new WebhookClient({ url }),
    ]),
  ) as { [key in keyof WebhookConfig]: WebhookClient };

  button = () => new ExtendedButtonBuilder();

  commands: Collection<string, Command> = new Collection();

  sleep = async (s: number) =>
    void (await new Promise<void>((resolve) => setTimeout(resolve, s * 1000)));

  log = (message: string, type?: LogLevel) => void log(message, type);
  formatBytes = (...args: formatBytes) => Methods.formatBytes(...args);
  loadCommandsEvents = async () => void (await Methods.loadCommandsEvents(this));
  formatDuration = (...args: formatDuration) => Methods.formatDuration(...args);

  cooldowns: Collection<string, Collection<string, number>> = new Collection();

  embed = (color?: ColorResolvable) => new ExtendedEmbedBuilder(color || this.config.color);
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
