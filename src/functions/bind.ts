/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { log } from "../logger.js";
import { createCipheriv, randomBytes } from "node:crypto";
import { readFile, writeFile, unlink } from "node:fs/promises";

export const bind = async (source: string, dest: string) => {
  log(`Generating new ${dest}`);

  const iv = randomBytes(16);
  const key = randomBytes(32);

  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = cipher.update(await readFile(source, "utf8"), "utf-8", "hex");
  const encryptData = encrypted + cipher.final("hex");

  await writeFile(dest, encryptData, "utf-8");
  await unlink(source);

  console.clear();
  log(`New ${dest} generated`, "success");
  log("Save the following credentials securely.", "warn");
  log(`Initialization Vector (IV): ${iv.toString("hex")}`, "info");
  log(`Decryption key (Key): ${key.toString("hex")}`, "info");
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
