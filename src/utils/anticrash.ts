/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { log } from '../logger.js';

export const loadAntiCrash = () => {
  process.on('unhandledRejection', (...args) => {
    log('[ Anti-Crash ] - UnhandledRejection :', 'error');
    console.log(...args);
  });
  process.on('uncaughtException', (...args) => {
    log('[ Anti-Crash ] - UncaughtException :', 'error');
    console.log(...args);
  });

  log('[ Anti-Crash ] is now LiVE checking over crashes', 'success');
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
