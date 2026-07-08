import { registerPlugin } from '@capacitor/core';
import { PersistenceProvider, RepositoryProvider, StorageProvider } from './types';

// Declare the Capacitor plugin type definition
export interface SwiftDataPluginType {
  initialize(): Promise<void>;
  findAll(options: { tableName: string }): Promise<{ items: string[] }>;
  findById(options: { tableName: string; id: string }): Promise<{ item: string | null }>;
  save(options: { tableName: string; id: string; itemJson: string }): Promise<{ item: string }>;
  delete(options: { tableName: string; id: string }): Promise<{ success: boolean }>;
  query(options: { tableName: string }): Promise<{ items: string[] }>;
  clearAllData(): Promise<void>;
}

// Register the Capacitor plugin
const SwiftDataPlugin = registerPlugin<SwiftDataPluginType>('SwiftDataPlugin');

export class SwiftDataRepository<T extends { id: string }> implements RepositoryProvider<T> {
  constructor(private readonly tableName: string) {}

  async findAll(): Promise<T[]> {
    const res = await SwiftDataPlugin.findAll({ tableName: this.tableName });
    return res.items.map(json => JSON.parse(json));
  }

  async findById(id: string): Promise<T | null> {
    const res = await SwiftDataPlugin.findById({ tableName: this.tableName, id });
    return res.item ? JSON.parse(res.item) : null;
  }

  async save(item: T): Promise<T> {
    const res = await SwiftDataPlugin.save({
      tableName: this.tableName,
      id: item.id,
      itemJson: JSON.stringify(item),
    });
    return JSON.parse(res.item);
  }

  async delete(id: string): Promise<boolean> {
    const res = await SwiftDataPlugin.delete({ tableName: this.tableName, id });
    return res.success;
  }

  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.findAll();
    return items.filter(predicate);
  }
}

export class SwiftDataStorageProvider implements StorageProvider {
  async uploadFile(path: string, file: File | Blob): Promise<string> {
    return `mock-local-url://${path}`;
  }

  async getFileUrl(path: string): Promise<string> {
    return `mock-local-url://${path}`;
  }

  async deleteFile(path: string): Promise<boolean> {
    return true;
  }
}

export class SwiftDataPersistenceProvider implements PersistenceProvider {
  async initialize(): Promise<void> {
    try {
      await SwiftDataPlugin.initialize();
      console.log('[Persistence] Initialized SwiftData Native Provider.');
    } catch (e) {
      console.error('[Persistence] SwiftData initialization failed:', e);
      throw e;
    }
  }

  async clearAllData(): Promise<void> {
    await SwiftDataPlugin.clearAllData();
  }

  getRepository<T extends { id: string }>(tableName: string): RepositoryProvider<T> {
    return new SwiftDataRepository<T>(tableName);
  }

  getStorage(): StorageProvider {
    return new SwiftDataStorageProvider();
  }
}
