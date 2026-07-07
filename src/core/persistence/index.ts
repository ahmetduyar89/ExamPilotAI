import type { PersistenceProvider } from './types';
import { LocalPersistenceProvider } from './LocalPersistenceProvider';

/**
 * Dependency Injection Container for Persistence
 */
export class PersistenceRegistry {
  private static instance: PersistenceProvider;

  static getProvider(): PersistenceProvider {
    if (!this.instance) {
      // Default to LocalStorage for now. 
      // In the future, this can be swapped with SwiftDataPersistenceProvider
      this.instance = new LocalPersistenceProvider();
      this.instance.initialize();
    }
    return this.instance;
  }

  /**
   * Allows injecting a specific provider for testing or swapping to SwiftData.
   */
  static setProvider(provider: PersistenceProvider) {
    this.instance = provider;
    this.instance.initialize();
  }
}
