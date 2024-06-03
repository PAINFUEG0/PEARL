/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import moment from 'moment';
import format from 'moment-duration-format';
import { ExtendedClient } from './client.js';
import { loadEvents } from '../loaders/events.js';
import { loadCommands } from '../loaders/msgCmds.js';

format(moment);

export type formatDuration = [duration: number];
export type loadCommandsEvents = [client: ExtendedClient];
export type formatBytes = [bytes: number, unit?: boolean, places?: number];

export class Methods {
  static loadCommandsEvents = async (...args: loadCommandsEvents) => {
    const [client] = args;
    await loadEvents(client);
    await loadCommands(client);
  };

  static formatDuration = (...args: formatDuration) => {
    const [duration] = args;
    return moment.duration(duration, 'milliseconds').format('d[d] h[h] m[m] s[s]', 3, {
      trim: 'left',
    });
  };

  static formatBytes = (...args: formatBytes) => {
    const [bytes, unit = true, places = 2] = args;
    const decimals = 0 > places ? 0 : places;
    const power = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, power)).toFixed(decimals))}${
      unit ? ` ${['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][power]}` : ''
    }`;
  };
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
