/**
 * The base interface for all domain repositories.
 * T is the strongly typed model it handles.
 */
export interface RepositoryProvider<T extends { id: string }> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  save(item: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  query(predicate: (item: T) => boolean): Promise<T[]>;
}

/**
 * Handles raw file uploads and binary storage (e.g. photos of exams).
 */
export interface StorageProvider {
  uploadFile(path: string, file: File | Blob): Promise<string>;
  getFileUrl(path: string): Promise<string>;
  deleteFile(path: string): Promise<boolean>;
}

/**
 * The root provider that manages initialization or global transactions.
 */
export interface PersistenceProvider {
  initialize(): Promise<void>;
  clearAllData(): Promise<void>;
  
  // Exposes a generic repository factory
  getRepository<T extends { id: string }>(tableName: string): RepositoryProvider<T>;
  getStorage(): StorageProvider;
}
