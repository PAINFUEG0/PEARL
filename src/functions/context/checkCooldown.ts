/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */
import { Collection } from 'discord.js';
import { fromMs } from '../ms/fromMs.js';
import { limited } from '../../utils/ratelimiter.js';
import { RateLimitManager } from '@sapphire/ratelimits';
import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';

const cooldownRateLimitManager = new RateLimitManager(5000);

export const checkCooldown = async (ctx: Context, command: Command) => {
  const client = ctx.client;

  if (limited(ctx.author.id)) {
    await client.db.blacklist.set(ctx.author.id, true);
    client.emit('blUser', ctx);
    return false;
  }

  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name) as Collection<string, number>;
  const cooldownAmount = command.cooldown * 1000 || 5_000;

  if (timestamps.has(ctx.author.id)) {
    const expirationTime = timestamps.get(ctx.author.id)! + cooldownAmount;

    if (now < expirationTime) {
      const cooldownRlBucket = cooldownRateLimitManager.acquire(`${ctx.author.id}_${command.name}`);
      if (cooldownRlBucket.limited) return false;
      try {
        cooldownRlBucket.consume();
      } catch {
        null;
      }

      const expiredTimestamp = Math.round(expirationTime - now);
      await ctx.reply({
        embeds: [
          client
            .embed('Yellow')
            .desc(
              `${client.emoji.warn} \`Please wait ${fromMs(
                expiredTimestamp,
              )} before reusing this command.\``,
            ),
        ],
      });

      return true;
    }
  }

  timestamps.set(ctx.author.id, now);
  setTimeout(() => timestamps.delete(ctx.author.id), cooldownAmount);
  return false;
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
