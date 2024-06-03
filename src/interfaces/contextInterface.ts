/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import {
  User,
  Role,
  Guild,
  Channel,
  Message,
  Attachment,
  Collection,
  GuildMember,
  MessageReaction,
  BaseMessageOptions,
  CommandInteraction,
  GuildTextBasedChannel,
  EmojiIdentifierResolvable,
} from 'discord.js';
import { ExtendedClient } from '../classes/client.js';

export interface Context {
  id: string;
  guild: Guild;
  author: User;
  content: string;
  guildId: string;
  channelId: string;
  message?: Message;
  member: GuildMember;
  client: ExtendedClient;
  channel: GuildTextBasedChannel;
  interaction?: CommandInteraction;
  mentions: {
    everyone: boolean;
    users?: Collection<string, User>;
    roles?: Collection<string, Role>;
    channels?: Collection<string, Channel>;
    members?: Collection<string, GuildMember>;
  };
  createdTimestamp: number;
  attachments?: Collection<string, Attachment>;
  send: (args: BaseMessageOptions) => Promise<Message<boolean>>;
  reply: (args: BaseMessageOptions) => Promise<Message<boolean>>;
  react: (emoji: EmojiIdentifierResolvable, args?: BaseMessageOptions) => Promise<MessageReaction>;
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
