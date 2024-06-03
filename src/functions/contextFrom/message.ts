/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { Message } from 'discord.js';
import { ExtendedClient } from '../../classes/client.js';
import { Context } from '../../interfaces/contextInterface.js';

export const createContext = async (client: ExtendedClient, message: Message) => {
  if (!message.guild || !message.member || !message.channel || message.channel.isDMBased()) return;

  const _mentions: Context['mentions'] = {
    everyone: message.mentions.everyone,
  };

  if (message.mentions.users?.size) _mentions.users = message.mentions.users;
  if (message.mentions.roles?.size) _mentions.roles = message.mentions.roles;
  if (message.mentions.members?.size) _mentions.members = message.mentions.members;
  if (message.mentions.channels?.size) _mentions.channels = message.mentions.channels;

  const _attachments = message.attachments.size ? message.attachments : undefined;

  const ctx: Context = {
    id: message.id,
    client: client,
    message: message,
    mentions: _mentions,
    guild: message.guild,
    member: message.member,
    author: message.author,
    channel: message.channel,
    content: message.content,
    guildId: message.guild.id,
    attachments: _attachments,
    channelId: message.channel.id,
    react: async (e, c) => {
      if (c) await message.reply(c);
      return await message.react(e);
    },
    createdTimestamp: message.createdTimestamp,
    reply: async (args) => await message.reply(args),
    send: async (args) => await message.channel.send(args),
  };

  return ctx;
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
