/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { cpuUsage } from 'os-utils';
import { ExtendedClient } from '../../classes/client.js';
import { Command } from '../../classes/abstract/command.js';
import { Context } from '../../interfaces/contextInterface.js';

export default class StatsCommand extends Command {
  override aliases = ['status'];
  description = 'Shows my general stats';

  async execute(client: ExtendedClient, ctx: Context) {
    const fill = '........       ';
    const get =
      `${client.emoji.timer} \`${'Websocket ping'.padEnd(17, ' ')} -   ${fill}\`\n` +
      `${client.emoji.timer} \`${'Client uptime'.padEnd(17, ' ')} -   ${fill}\`\n` +
      `${client.emoji.timer} \`${'Sys RAM usage'.padEnd(17, ' ')} -   ${fill}\`\n` +
      `${client.emoji.timer} \`${'Sys CPU usage'.padEnd(17, ' ')} -   ${fill}\`\n` +
      `${client.emoji.timer} \`${'Total servers'.padEnd(17, ' ')} -   ${fill}\`\n` +
      `${client.emoji.timer} \`${'Total users '.padEnd(17, ' ')} -   ${fill}\`\n`;

    const reply = await ctx.reply({
      embeds: [client.embed().desc(get)],
    });

    const totalUsers = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);

    const _cpuUsage: number = await new Promise((resolve) => cpuUsage(resolve));

    const ping = `${client.ws.ping} ms`;
    const uptime = client.formatDuration(client.uptime as number);
    const ram = client.formatBytes(process.memoryUsage().heapUsed);
    const cpu = `${_cpuUsage.toFixed(2)} %vCPU`;
    const guilds = `${client.guilds.cache.size / 1000}K`;
    const users = `${totalUsers / 1000}K`;

    const stats =
      `${client.emoji.info} \`${'Websocket ping'.padEnd(17, ' ')} -   ${ping.padEnd(15, ' ')}\`\n` +
      `${client.emoji.info} \`${'Client uptime'.padEnd(17, ' ')} -   ${uptime.padEnd(
        15,
        ' ',
      )}\`\n` +
      `${client.emoji.info} \`${'Sys RAM usage'.padEnd(17, ' ')} -   ${ram.padEnd(15, ' ')}\`\n` +
      `${client.emoji.info} \`${'Sys CPU usage'.padEnd(17, ' ')} -   ${cpu.padEnd(15, ' ')}\`\n` +
      `${client.emoji.info} \`${'Total servers'.padEnd(17, ' ')} -   ${guilds.padEnd(
        15,
        ' ',
      )}\`\n` +
      `${client.emoji.info} \`${'Total users '.padEnd(17, ' ')} -   ${users.padEnd(15, ' ')}\`\n`;

    await reply.edit({
      embeds: [client.embed().desc(stats)],
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
