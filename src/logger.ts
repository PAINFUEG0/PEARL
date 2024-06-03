/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import chalk from "chalk";
import moment from "moment-timezone";

export type LogLevel = keyof typeof styles;

const styles = {
  info: { color: chalk.hex("#66ccff"), display: "INFO" },
  debug: { color: chalk.hex("#555555"), display: "DEBUG" },
  error: { color: chalk.hex("#ff2200"), display: "ERROR" },
  warn: { color: chalk.hex("#ffaa00"), display: "WARNING" },
  success: { color: chalk.hex("#77ee55"), display: "SUCCESS" },
};

export const log = (content: string, logLevel: LogLevel = "debug") => {
  const style = styles[logLevel];

  console.log(
    `${chalk.hex("#555555")(
      moment().tz("Asia/Kolkata").format("DD-MM-YYYY hh:mm:ss"),
    )} - ${style.color(style.display)} - ${chalk.hex("#880088")(content)}`,
  );
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
