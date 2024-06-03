/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import moment from 'moment-timezone';
import { Event } from '../../classes/abstract/event.js';
import { ExtendedClient } from '../../classes/client.js';
import { Events } from '../../interfaces/eventsInterface.js';
import { Context } from '../../interfaces/contextInterface.js';
import { resolvePerms } from '../../functions/context/resolvePerms.js';
import { enforceAdmin } from '../../functions/context/enforceAdmin.js';
import { resolveAdmin } from '../../functions/context/resolveAdmin.js';
import { checkCooldown } from '../../functions/context/checkCooldown.js';
import { resolvePrefix } from '../../functions/context/resolvePrefix.js';
import { resolveCommand } from '../../functions/context/resolveCommand.js';

const event: keyof Events = 'ctxCreate';

export default class ContextCreateEvent implements Event<typeof event> {
  name = event;

  async execute(client: ExtendedClient, ctx: Context) {
    if (!ctx) return;

    const [owner, admin, userPrefix, guildPrefix, bl] = await Promise.all([
      client.owners.includes(ctx.author.id),
      client.admins.includes(ctx.author.id),
      client.db.prefix.user.get(ctx.member.id) as Promise<string | null>,
      client.db.prefix.guild.get(ctx.guild.id) as Promise<string | null>,
      (client.db.blacklist.get(ctx.author.id) || false) as Promise<boolean>,
    ]);

    const np = owner || admin ? true : false;
    const botAdmin = owner || admin ? true : false;

    if (bl) return;

    if (!(await resolvePerms.basic(ctx))) return;

    if (ctx.content.match(new RegExp(`^<@!?${client.user!.id}>( |)$`))) {
      return client.emit('mention', ctx);
    }

    const resolvedPrefix = resolvePrefix(ctx, np, userPrefix, guildPrefix);
    if (resolvedPrefix === 'No results') return;

    const { command, args } = await resolveCommand(ctx, resolvedPrefix);

    if (!command) return;

    if (!botAdmin) if (await checkCooldown(ctx, command)) return;

    const [botPerms, userPerms] = await Promise.all([
      resolvePerms.bot(ctx, command),
      resolvePerms.user(ctx, command, botAdmin),
    ]);

    if (!(botPerms && userPerms)) return;

    if (!(await enforceAdmin(ctx, botAdmin))) return; //enable this line if u want bot to have admin perms as mandatory

    if (!(await resolveAdmin(ctx, command, owner, admin))) return;

    if (client.underMaintenance && !botAdmin) return client.emit('underMaintenance', ctx);

    if (args[0]?.toLowerCase() === '-h') return client.emit('infoRequested', ctx, command);

    await command.execute(client, ctx, args);

    const date = `${moment().tz('Asia/Kolkata').format('DD-MM-YYYY')}`;

    (await client.db.stats.commandsUsed.get('total'))
      ? await client.db.stats.commandsUsed.inc('total')
      : await client.db.stats.commandsUsed.set('total', 1);

    (await client.db.stats.commandsUsed.get(date))
      ? await client.db.stats.commandsUsed.inc(date)
      : await client.db.stats.commandsUsed.set(date, 1);

    await client.webhooks.cmdLogs.send({
      username: `Command-logs`,
      avatarURL: `${client.user?.displayAvatarURL()}`,
      embeds: [
        client
          .embed()
          .desc(
            `${client.emoji.bl} \`(${moment().tz('Asia/Kolkata')})\`\n\n` +
              `${client.emoji.info} \`${ctx.content}\`\n` +
              `${client.emoji.info} \`Command used : ${command.name}\`\n` +
              `${client.emoji.info} \`User : \`${ctx.author}\`[${ctx.author.id}]\`\n` +
              `${client.emoji.info} \`Guild : ${ctx.guild.name.substring(0, 20)} [${
                ctx.guild.id
              }]\`\n` +
              `${client.emoji.info} \`Channel : \`${ctx.channel}\`[${ctx.channel.id}]\`\n`,
          ),
      ],
    });

    return;
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
