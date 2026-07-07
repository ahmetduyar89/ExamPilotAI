import { IntakeSession } from '../types';
import { PersistenceRegistry } from '@/core/persistence';

const getRepo = () => PersistenceRegistry.getProvider().getRepository<IntakeSession>('intakes');

export const intakeRepo = {
  getById: async (id: string): Promise<IntakeSession | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const result = await getRepo().findById(id);
    return result || undefined;
  },
  
  getByDocumentSessionId: async (docSessionId: string): Promise<IntakeSession | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const results = await getRepo().query(s => s.documentSessionId === docSessionId);
    return results[0] || undefined;
  },

  create: async (session: IntakeSession): Promise<IntakeSession> => {
    return getRepo().save(session);
  }
};
