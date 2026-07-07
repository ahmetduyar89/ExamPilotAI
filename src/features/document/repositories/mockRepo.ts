import { DocumentSession, CreateSessionDTO } from '../types';
import { PersistenceRegistry } from '@/core/persistence';

const getRepo = () => PersistenceRegistry.getProvider().getRepository<DocumentSession>('documents');

export const documentRepo = {
  getById: async (id: string): Promise<DocumentSession | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const result = await getRepo().findById(id);
    return result || undefined;
  },

  create: async (data: CreateSessionDTO): Promise<DocumentSession> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newSession: DocumentSession = {
      ...data,
      id: crypto.randomUUID(),
      status: 'uploaded',
      publisher: 'unknown',
      confidence: 1.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return getRepo().save(newSession);
  },

  update: async (id: string, updates: Partial<DocumentSession>): Promise<DocumentSession> => {
    const existing = await getRepo().findById(id);
    if (!existing) throw new Error('Session not found');
    
    const updated = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    return getRepo().save(updated);
  }
};
