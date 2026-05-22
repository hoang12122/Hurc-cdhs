/**
 * Node.js Runtime Path Alias Resolver for Prisma Clients in Production
 * Maps '@prisma/client/auth' etc. to '/app/.prisma-runtime/auth' dynamically.
 */
const Module = require('module');
const path = require('path');

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@prisma/client/')) {
    const subDb = request.substring('@prisma/client/'.length);
    // Resolve to the absolute path of the generated client inside .prisma-runtime
    const targetPath = path.resolve(__dirname, '..', '.prisma-runtime', subDb);
    // console.log(`[register.js] Redirecting ${request} -> ${targetPath}`);
    return originalResolveFilename.call(this, targetPath, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Execute the compiled migration script
console.log('🔄 [register.js] Path alias loaded. Starting migration script...');
require('./migrate-json-to-pg.js');
