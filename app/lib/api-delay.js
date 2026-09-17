import { MAX_API_DELAY_MS } from './url-state.js';
import { delay } from './utils.js';

export async function waitForApiDelay(requestedMs = 0) {
  const uiMs = Number.isFinite(requestedMs)
    ? Math.min(MAX_API_DELAY_MS, Math.max(0, requestedMs))
    : 0;
  return delay(uiMs, uiMs > 0);
}
