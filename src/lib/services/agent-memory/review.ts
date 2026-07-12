import { IS_DATABASE_OFFLINE } from '../../prisma';
import { reviewOfflineMemory } from './offline-storage';
import { reviewOnlineMemory } from './online-storage';
import type {
  AgentMemory,
  MemoryReviewDecision,
} from './types';

export async function reviewMemory(
  memoryId: string,
  decision: MemoryReviewDecision,
): Promise<AgentMemory | null> {
  return IS_DATABASE_OFFLINE
    ? reviewOfflineMemory(memoryId, decision)
    : reviewOnlineMemory(memoryId, decision);
}
