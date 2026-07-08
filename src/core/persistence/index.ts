import { Capacitor } from '@capacitor/core';
import type { PersistenceProvider } from './types';
import { LocalPersistenceProvider } from './LocalPersistenceProvider';
import { SwiftDataPersistenceProvider } from './SwiftDataPersistenceProvider';

/**
 * Dependency Injection Container for Persistence
 */
export class PersistenceRegistry {
  private static instance: PersistenceProvider;

  static getProvider(): PersistenceProvider {
    if (!this.instance) {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        this.instance = new SwiftDataPersistenceProvider();
      } else {
        this.instance = new LocalPersistenceProvider();
      }
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
