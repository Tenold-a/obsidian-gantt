import type { IStorage } from '@obsidian-gantt/core';

// We need to access Vault API. These will be cast appropriately at runtime.
export interface VaultAdapter {
  read(path: string): Promise<string>;
  write(path: string, data: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  list(path: string): Promise<{ files: string[]; folders: string[] }>;
  remove(path: string): Promise<void>;
}

const BASE = 'obsidian-gantt-data';

/** Recursively ensure a directory path exists using the vault adapter. */
async function ensureDir(dir: string, adapter: VaultAdapter): Promise<void> {
  const parts = dir.split('/');
  for (let i = 2; i <= parts.length; i++) {
    const partial = parts.slice(0, i).join('/');
    try {
      const exists = await adapter.exists(partial);
      if (!exists) {
        // Create directory by writing a marker file, then remove it
        const marker = `${partial}/.dir`;
        await adapter.write(marker, '');
        await adapter.remove(marker);
      }
    } catch {
      // Directory already exists or cannot be created; continue
    }
  }
}

export function createObsidianStorage(adapter: VaultAdapter): IStorage {
  const fullPath = (p: string) => `${BASE}/${p}`;

  return {
    async read(path: string): Promise<string | null> {
      const fp = fullPath(path);
      try {
        const exists = await adapter.exists(fp);
        if (!exists) return null;
        return await adapter.read(fp);
      } catch {
        return null;
      }
    },

    async write(path: string, data: string): Promise<void> {
      const fp = fullPath(path);
      try {
        await adapter.write(fp, data);
      } catch (e) {
        // If the parent directory doesn't exist, create it and retry.
        // Obsidian's vault adapter may throw on missing parent dirs
        // depending on the underlying adapter implementation.
        const dir = fp.split('/').slice(0, -1).join('/');
        try {
          const dirExists = await adapter.exists(dir);
          if (!dirExists) {
            // Recursively ensure parent directories exist
            await ensureDir(dir, adapter);
          }
          await adapter.write(fp, data);
        } catch (inner) {
          throw new Error(
            `Failed to write ${fp}: ${(inner as Error).message}`,
          );
        }
      }
    },

    async delete(path: string): Promise<void> {
      const fp = fullPath(path);
      try {
        await adapter.remove(fp);
      } catch {
        // Ignore delete failures
      }
    },

    async list(dir: string): Promise<string[]> {
      const dp = fullPath(dir);
      try {
        const result = await adapter.list(dp);
        // Obsidian adapter returns full paths relative to vault root
        // (e.g. "obsidian-gantt-data/views/demo.json").
        // Strip the base prefix and directory to return just filenames.
        const prefix = `${dp}/`;
        return result.files.map((f: string) => {
          if (f.startsWith(prefix)) return f.slice(prefix.length);
          if (f.startsWith(dp)) return f.slice(dp.length + 1);
          // Fallback: return basename
          const parts = f.split('/');
          return parts[parts.length - 1];
        });
      } catch {
        return [];
      }
    },
  };
}
