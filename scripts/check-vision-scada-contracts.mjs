#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const failures = [];
const scadaConfig = read('infra/scada-gateway/config.example.yaml');
const scadaRuntime = read('infra/scada-gateway/main.py');
const visionRuntime = read('infra/vision-trainer/main.py');
const compose = read('docker-compose.vision-scada.yml');
const productionImages = read('docker-compose.platform-production-images.yml');

const requireText = (content, text, message) => {
  if (!content.includes(text)) failures.push(message);
};

requireText(scadaConfig, 'read_only: true', 'SCADA example must be explicitly read-only.');
requireText(scadaRuntime, 'gateway.read_only=true', 'SCADA runtime must fail closed when read_only is not true.');
requireText(scadaRuntime, 'contains prohibited write configuration', 'SCADA runtime must reject write or command configuration.');
requireText(scadaRuntime, 'SCADA_GATEWAY_ENABLED", "false"', 'SCADA runtime must default disabled.');
requireText(scadaRuntime, 'PUBLISHER = Publisher() if ENABLED else None', 'Disabled SCADA must not create an MQTT publisher.');
requireText(scadaRuntime, 'if not ENABLED:', 'Disabled SCADA must not start source loops.');
requireText(scadaRuntime, '"writeCommands": False', 'SCADA capabilities must declare write commands disabled.');
requireText(visionRuntime, 'VISION_TRAINING_ENABLED', 'Vision training must have an explicit enable switch.');
requireText(visionRuntime, 'PENDING_REVIEW', 'Vision samples must enter a review state.');
requireText(visionRuntime, 'SUCCEEDED_REVIEW_REQUIRED', 'Completed models must require review.');
requireText(visionRuntime, 'APPROVED_NOT_DEPLOYED', 'Model approval must not auto-deploy.');
requireText(compose, 'SCADA_GATEWAY_ENABLED: ${SCADA_GATEWAY_ENABLED:-false}', 'SCADA runtime must default disabled.');
requireText(compose, 'VISION_TRAINING_ENABLED: ${VISION_TRAINING_ENABLED:-false}', 'Vision training must default disabled.');
requireText(productionImages, 'SCADA_GATEWAY_IMAGE', 'Production image contract must include SCADA gateway.');
requireText(productionImages, 'VISION_TRAINER_IMAGE', 'Production image contract must include Vision trainer.');

if (failures.length > 0) {
  console.error('[vision-scada-contract] FAILED');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('[vision-scada-contract] PASS: read-only SCADA and governed Vision contracts are present.');
