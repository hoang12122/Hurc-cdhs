#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

async function main() {
  const paths = process.argv.slice(2);
  if (paths.length === 0) throw new Error('Usage: node scripts/check-model-sbom.mjs <sbom.json> [...]');

  for (const filePath of paths) {
    const sbom = JSON.parse(await readFile(filePath, 'utf8'));
    const isCycloneDx = sbom.bomFormat === 'CycloneDX' && typeof sbom.specVersion === 'string';
    const isSpdx = typeof sbom.spdxVersion === 'string' && typeof sbom.SPDXID === 'string';
    if (!isCycloneDx && !isSpdx) throw new Error(`Unsupported SBOM format: ${filePath}`);

    const components = isCycloneDx ? sbom.components : sbom.packages;
    if (!Array.isArray(components) || components.length === 0) {
      throw new Error(`SBOM has no components/packages: ${filePath}`);
    }

    const serialized = JSON.stringify(sbom);
    for (const forbidden of ['PRIVATE KEY', 'BEGIN OPENSSH PRIVATE KEY', 'AKIA', 'model.bin']) {
      if (serialized.includes(forbidden)) throw new Error(`SBOM contains forbidden secret/binary marker: ${forbidden}`);
    }
  }

  console.log(`Validated ${paths.length} SBOM file(s)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
