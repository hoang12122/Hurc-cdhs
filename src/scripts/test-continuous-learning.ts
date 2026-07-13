import assert from 'node:assert/strict';
import { resolveContinuousLearningPolicy } from '../lib/services/ai/continuous-learning';

function main() {
  const defaults = resolveContinuousLearningPolicy({});
  assert.equal(defaults.enabled, true);
  assert.equal(defaults.mode, 'governed-shadow-learning');
  assert.equal(defaults.minimumConfidence, 0.8);
  assert.equal(defaults.minimumReinforcements, 3);
  assert.equal(defaults.humanApprovalRequired, true);
  assert.equal(defaults.automaticPromotion, false);
  assert.equal(defaults.autonomousCodeChanges, false);
  assert.equal(defaults.operationalWriteAccess, false);

  const bounded = resolveContinuousLearningPolicy({
    AI_LEARNING_WINDOW_DAYS: '999',
    AI_LEARNING_MIN_CONFIDENCE: '0.1',
    AI_LEARNING_MIN_REINFORCEMENTS: '999',
    AI_LEARNING_AUTO_PROMOTE: 'true',
    AI_AUTONOMOUS_CODE_CHANGES: 'true',
  });
  assert.equal(bounded.evaluationWindowDays, 180);
  assert.equal(bounded.minimumConfidence, 0.65);
  assert.equal(bounded.minimumReinforcements, 20);
  assert.equal(bounded.automaticPromotion, false);
  assert.equal(bounded.autonomousCodeChanges, false);
  assert.equal(bounded.operationalWriteAccess, false);

  const disabled = resolveContinuousLearningPolicy({
    AI_CONTINUOUS_LEARNING_ENABLED: 'false',
  });
  assert.equal(disabled.enabled, false);
  assert.equal(disabled.humanApprovalRequired, true);

  console.log('Continuous learning safety invariant checks passed.');
}

main();
