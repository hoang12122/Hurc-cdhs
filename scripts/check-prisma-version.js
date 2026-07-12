const fs = require('node:fs');
const path = require('node:path');

const EXPECTED_VERSION = '5.22.0';
const root = process.cwd();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function installedVersion(packageName) {
  const packagePath = packageName.startsWith('@')
    ? path.join(root, 'node_modules', ...packageName.split('/'), 'package.json')
    : path.join(root, 'node_modules', packageName, 'package.json');

  if (!fs.existsSync(packagePath)) {
    throw new Error(`Package metadata not found at ${packagePath}`);
  }

  return readJson(packagePath).version;
}

const project = readJson(path.join(root, 'package.json'));
const declaredPrisma = project.devDependencies?.prisma;
const declaredClient = project.devDependencies?.['@prisma/client'];

const failures = [];

if (declaredPrisma !== EXPECTED_VERSION) {
  failures.push(`package.json prisma must be ${EXPECTED_VERSION}; found ${declaredPrisma ?? 'missing'}`);
}

if (declaredClient !== EXPECTED_VERSION) {
  failures.push(`package.json @prisma/client must be ${EXPECTED_VERSION}; found ${declaredClient ?? 'missing'}`);
}

let actualPrisma;
let actualClient;

try {
  actualPrisma = installedVersion('prisma');
} catch (error) {
  failures.push(`Unable to read installed prisma package: ${error.message}`);
}

try {
  actualClient = installedVersion('@prisma/client');
} catch (error) {
  failures.push(`Unable to read installed @prisma/client package: ${error.message}`);
}

if (actualPrisma && actualPrisma !== EXPECTED_VERSION) {
  failures.push(`Installed prisma must be ${EXPECTED_VERSION}; found ${actualPrisma}`);
}

if (actualClient && actualClient !== EXPECTED_VERSION) {
  failures.push(`Installed @prisma/client must be ${EXPECTED_VERSION}; found ${actualClient}`);
}

if (failures.length > 0) {
  console.error('Prisma version contract failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Prisma version contract passed: prisma=${actualPrisma}, @prisma/client=${actualClient}`);
