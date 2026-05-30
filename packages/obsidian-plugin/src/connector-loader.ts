import type { IConnectorLoader, ConnectorModule, ConnectorContext, CsvParseOptions } from '@obsidian-gantt/core';
import { PlatformError, parseCSV } from '@obsidian-gantt/core';
import type { VaultAdapter } from './storage';

export function createObsidianConnectorLoader(
  adapter: VaultAdapter,
  requestUrl: (opts: { url: string; method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ json: unknown; status: number }>,
): IConnectorLoader {
  return {
    async load(scriptPath: string): Promise<ConnectorModule> {
      try {
        const source = await adapter.read(scriptPath);
        if (!source) {
          throw new PlatformError(
            `Connector script not found: ${scriptPath}`,
            'CONNECTOR_NOT_FOUND',
          );
        }

        // Execute the connector script in a controlled scope.
        // The script uses a CommonJS-like module.exports pattern.
        // We wrap it in an async function to capture the result.
        const moduleCode = `
          const module = { exports: {} };
          const exports = module.exports;
          ${source}
          return module.exports;
        `;

        // eslint-disable-next-line no-new-func
        const fn = new Function(moduleCode);
        const mod = fn() as ConnectorModule;

        if (!mod || typeof mod.fetch !== 'function' || typeof mod.transform !== 'function') {
          throw new PlatformError(
            `Connector script must export fetch() and transform() functions. Found: ${Object.keys(mod ?? {}).join(', ')}`,
            'CONNECTOR_SCRIPT_ERROR',
          );
        }

        return mod;
      } catch (e) {
        if (e instanceof PlatformError) throw e;
        throw new PlatformError(
          `Failed to load connector script: ${(e as Error).message}`,
          'CONNECTOR_SCRIPT_ERROR',
          e as Error,
        );
      }
    },
  };
}

export function createObsidianConnectorContext(
  config: Record<string, unknown>,
  vaultAdapter: VaultAdapter,
  requestUrl: (opts: { url: string; method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ json: unknown; status: number }>,
): ConnectorContext {
  return {
    config,
    log: (...args: unknown[]) => console.log('[Gantt Connector]', ...args),
    request: async (url: string, opts?: RequestInit): Promise<Response> => {
      const result = await requestUrl({
        url,
        method: opts?.method ?? 'GET',
        headers: opts?.headers as Record<string, string> | undefined,
        body: opts?.body as string | undefined,
      });
      return {
        ok: result.status >= 200 && result.status < 300,
        status: result.status,
        json: async () => result.json,
        text: async () => String(result.json),
      } as Response;
    },
    readFile: async (path: string): Promise<string> => {
      return await vaultAdapter.read(path);
    },
    parseCSV: (text: string, options?: CsvParseOptions): Record<string, string>[] => {
      return parseCSV(text, options);
    },
  };
}
