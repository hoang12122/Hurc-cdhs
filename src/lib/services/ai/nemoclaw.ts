/**
 * NemoClaw Client Adapter
 * 
 * Re-exports the unified NemoClawClient from the parent services folder.
 * This avoids duplicate client configurations and prevents out-of-sync API endpoints.
 */

export { getNemoClawClient, NemoClawError } from '../nemoclaw-client';
export type { ChatMessage, ChatCompletionResponse, NemoClawHealthStatus, ChatCompletionRequest, ChatCompletionTool } from '../nemoclaw-client';
