/** @format
 *
 * Version: 1.0.0
 * Pearl by painfuego
 * © 2024 1sT - Services
 */

import { createWriteStream } from 'node:fs';
import archiver, { Archiver } from 'archiver';
import { readdir, stat, unlink, access } from 'node:fs/promises';
import { resolve, join, relative, extname, normalize } from 'node:path';

const ignorableExtensions = ['.zip'];
const excludes = ['.git', '.pm2', '.npm', 'dist', 'node_modules', 'npm-shrinkwrap.json'];

const resolvedDirectoryPath = resolve('./');
const excludesNormalized = excludes.map((element) => normalize(element));
const ignorableExtensionsSet = new Set(ignorableExtensions.map((ext) => ext.toLowerCase()));

const shouldExclude = (filePath: string) => {
  return (
    ignorableExtensionsSet.has(extname(filePath).toLowerCase()) ||
    excludesNormalized.includes(relative(resolvedDirectoryPath, filePath))
  );
};

const traverseDirectoryTree = async (currentPath: string, archive: Archiver) => {
  for (const entry of await readdir(currentPath)) {
    const elementPath = join(resolve(currentPath), entry);

    const element = await stat(elementPath);

    if (element.isFile() && !shouldExclude(elementPath)) {
      archive.file(elementPath, {
        name: relative(resolvedDirectoryPath, elementPath),
      });
    } else if (element.isDirectory() && !shouldExclude(elementPath)) {
      await traverseDirectoryTree(elementPath, archive);
    }
  }
};

export const zipper = async (zipPath: string) => {
  const resolvedZipPath = resolve(zipPath);

  await access(resolvedZipPath)
    .then(async () => await unlink(resolvedZipPath))
    .catch(() => null);

  const output = createWriteStream(resolvedZipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.pipe(output);

  await traverseDirectoryTree(resolvedDirectoryPath, archive);

  await archive.finalize();

  await new Promise((resolve) => {
    output.on('close', resolve);
  });

  return resolvedZipPath;
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
