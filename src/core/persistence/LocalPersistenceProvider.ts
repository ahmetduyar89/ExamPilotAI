import { PersistenceProvider, RepositoryProvider, StorageProvider } from './types';

export class LocalStorageRepository<T extends { id: string }> implements RepositoryProvider<T> {
  constructor(private readonly tableName: string) {}

  private getItems(): T[] {
    const data = localStorage.getItem(`exampilot_${this.tableName}`);
    return data ? JSON.parse(data) : [];
  }

  private setItems(items: T[]): void {
    localStorage.setItem(`exampilot_${this.tableName}`, JSON.stringify(items));
  }

  async findAll(): Promise<T[]> {
    return this.getItems();
  }

  async findById(id: string): Promise<T | null> {
    const items = this.getItems();
    return items.find(i => i.id === id) || null;
  }

  async save(item: T): Promise<T> {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    this.setItems(items);
    return item;
  }

  async delete(id: string): Promise<boolean> {
    const items = this.getItems();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length !== items.length) {
      this.setItems(filtered);
      return true;
    }
    return false;
  }

  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const items = this.getItems();
    return items.filter(predicate);
  }
}

export class LocalStorageProvider implements StorageProvider {
  async uploadFile(path: string, file: File | Blob): Promise<string> {
    // In a real local mock, we might convert to base64 or just return a fake URL
    return `mock-local-url://${path}`;
  }

  async getFileUrl(path: string): Promise<string> {
    return `mock-local-url://${path}`;
  }

  async deleteFile(path: string): Promise<boolean> {
    return true;
  }
}

export class LocalPersistenceProvider implements PersistenceProvider {
  async initialize(): Promise<void> {
    console.log('[Persistence] Initialized LocalStorage Provider.');
  }

  async clearAllData(): Promise<void> {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('exampilot_')) {
        localStorage.removeItem(key);
      }
    });
  }

  getRepository<T extends { id: string }>(tableName: string): RepositoryProvider<T> {
    return new LocalStorageRepository<T>(tableName);
  }

  getStorage(): StorageProvider {
    return new LocalStorageProvider();
  }
}
