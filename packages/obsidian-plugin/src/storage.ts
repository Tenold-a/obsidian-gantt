import type { IStorage } from '@obsidian-gantt/core';

// We need to access Vault API. These will be cast appropriately at runtime.
interface VaultAdapter {
  read(path: string): Promise<string>;
  write(path: string, data: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  list(path: string): Promise<{ files: string[]; folders: string[] }>;
  remove(path: string): Promise<void>;
}

const BASE = '.obsidian-gantt';

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
      // Ensure parent directory exists
      const dir = fp.split('/').slice(0, -1).join('/');
      try {
        const dirExists = await adapter.exists(dir);
        if (!dirExists) {
          // Create intermediate dirs by writing a temp file and removing it
          await adapter.write(fp, '');
          await adapter.remove(fp);
        }
      } catch {
        // Directory creation may fail if the path already exists; proceed.
      }
      await adapter.write(fp, data);
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
        return result.files;
      } catch {
        return [];
      }
    },
  };
}
