"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * HURC1 CONTAINER INITIALIZATION (Zero-Failure Deploy)
 * Handles DB migrations and connectivity checks inside the container.
 */
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var isOffline, dbPath, dbDir, schemas, MAX_RETRIES, RETRY_DELAY_1, _i, schemas_1, s, success, attempts, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 HURC1: Container Initialization started...");
                    isOffline = process.env.IS_DATABASE_OFFLINE === 'true';
                    if (!isOffline) return [3 /*break*/, 1];
                    console.log("📦 Mode: OFFLINE. Skipping Prisma migrations.");
                    dbPath = process.env.DATABASE_JSON_PATH || '/app/data/offline/db.json';
                    dbDir = path_1.default.dirname(dbPath);
                    if (!fs_1.default.existsSync(dbDir)) {
                        console.log("Creating directory ".concat(dbDir, "..."));
                        fs_1.default.mkdirSync(dbDir, { recursive: true });
                    }
                    if (!fs_1.default.existsSync(dbPath)) {
                        console.log("Initializing empty db.json...");
                        fs_1.default.writeFileSync(dbPath, JSON.stringify({
                            users: [], equipment: [], assets: [], tasks: [], inspections: [], dnf_documents: [], system_logs: []
                        }));
                    }
                    return [3 /*break*/, 9];
                case 1:
                    console.log("🌐 Mode: ONLINE. Running Prisma migrations...");
                    schemas = ['auth', 'ai', 'metro', 'ops'];
                    MAX_RETRIES = 10;
                    RETRY_DELAY_1 = 5000;
                    _i = 0, schemas_1 = schemas;
                    _a.label = 2;
                case 2:
                    if (!(_i < schemas_1.length)) return [3 /*break*/, 9];
                    s = schemas_1[_i];
                    success = false;
                    attempts = 0;
                    _a.label = 3;
                case 3:
                    if (!(!success && attempts < MAX_RETRIES)) return [3 /*break*/, 8];
                    attempts++;
                    console.log("Migrating schema: ".concat(s, " (Attempt ").concat(attempts, "/").concat(MAX_RETRIES, ")..."));
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 5, , 7]);
                    (0, child_process_1.execSync)("npx prisma migrate deploy --schema=prisma/".concat(s, "/schema.prisma"), { stdio: 'inherit' });
                    success = true;
                    return [3 /*break*/, 7];
                case 5:
                    e_1 = _a.sent();
                    if (attempts >= MAX_RETRIES) {
                        console.error("\u274C Migration failed for ".concat(s, " after ").concat(MAX_RETRIES, " attempts. Exiting."));
                        process.exit(1);
                    }
                    console.warn("\u26A0\uFE0F Migration attempt ".concat(attempts, " failed. Database might be booting. Retrying in 5s..."));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, RETRY_DELAY_1); })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 3];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9:
                    console.log("✅ Initialization complete. Handing over to Next.js...");
                    (0, child_process_1.execSync)('node server.js', { stdio: 'inherit' });
                    return [2 /*return*/];
            }
        });
    });
}
init().catch(function (err) {
    console.error("❌ Container init failed:", err);
    process.exit(1);
});
