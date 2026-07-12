/**
 * GOVERNED AGENT MEMORY FIREWALL
 *
 * Public compatibility facade. Implementation is split into focused modules
 * under ./agent-memory so each TypeScript file remains within the design
 * boundary while existing imports continue to work unchanged.
 */

export type {
  AgentMemory,
  MemoryHealth,
  MemoryReviewDecision,
  MemorySourceType,
  MemoryVerificationStatus,
  RetrieveMemoryOptions,
  StoreExperienceOptions,
} from './agent-memory/types';

export { storeExperience } from './agent-memory/store';
export {
  getMemoryHealth,
  getQuarantinedMemories,
  retrieveMemories,
} from './agent-memory/retrieval';
export { reviewMemory } from './agent-memory/review';

import { retrieveMemories } from './agent-memory/retrieval';

/**
 * Integrate governed memory into an AI request without changing existing
 * callers. The central AI manager still applies the Control Plane policy.
 */
export async function askAIWithMemory(
  prompt: string,
  userId: string,
  options: any = {},
) {
  const pastContext = await retrieveMemories(
    userId,
    prompt.substring(0, 200),
    5,
    {
      role: options.role,
      domain: options.domain,
      namespace: options.namespace,
    },
  );
  const fullPrompt = pastContext
    ? `${pastContext}\n\n[CÂU HỎI HIỆN TẠI]: ${prompt}`
    : prompt;

  const { askAI } = await import('./ai/manager');
  return askAI(fullPrompt, { ...options, userId });
}
