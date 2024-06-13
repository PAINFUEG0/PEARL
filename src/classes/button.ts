/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { ButtonStyle, ButtonBuilder, ComponentEmojiResolvable } from 'discord.js';

type ButtonOptions = [
  customId: string,
  label?: string,
  emoji?: ComponentEmojiResolvable,
  disabled?: boolean,
];

type LinkButtonOptions = [label: string, uri: string];

export class ExtendedButtonBuilder extends ButtonBuilder {
  private makeButton(style: ButtonStyle, ...args: ButtonOptions | LinkButtonOptions) {
    if (style === 5) {
      const [label, uri] = args as LinkButtonOptions;
      return this.setStyle(style).setLabel(label).setURL(uri);
    }

    const [customId, label, emoji, disabled] = args as ButtonOptions;
    if (!(label || emoji)) throw new Error('Must provide either label or emoji !');
    if (label) this.setLabel(label);
    if (emoji) this.setEmoji(emoji);
    return this.setStyle(style)
      .setCustomId(customId)
      .setDisabled(disabled || false);
  }

  link = (...args: LinkButtonOptions) => this.makeButton(ButtonStyle.Link, ...args);
  danger = (...args: ButtonOptions) => this.makeButton(ButtonStyle.Danger, ...args);
  primary = (...args: ButtonOptions) => this.makeButton(ButtonStyle.Primary, ...args);
  success = (...args: ButtonOptions) => this.makeButton(ButtonStyle.Success, ...args);
  secondary = (...args: ButtonOptions) => this.makeButton(ButtonStyle.Secondary, ...args);
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
