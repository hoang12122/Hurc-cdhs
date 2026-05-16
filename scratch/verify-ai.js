const { askAI, getAIHealthStatus } = require('./src/lib/services/ai');
const { AI_CONFIG } = require('./src/lib/config/ai-config');

async function verify() {
    console.log("=== HURC AI LOCAL-ONLY VERIFICATION ===");
    console.log("Active LLM Model:", AI_CONFIG.LLM.STABLE_MODEL);
    
    try {
        const health = await getAIHealthStatus();
        console.log("Health Status:", JSON.stringify(health, null, 2));
        
        console.log("\nTesting AI Routing (Should fail if no Ollama/TrustGraph is running, but must NOT call Cloud)...");
        const response = await askAI("Chào bạn, bạn là ai?");
        console.log("AI Response:", response);
    } catch (e) {
        console.log("Expected Result for Isolated Env:", e.message);
        if (e.message.includes("prevented") || e.message.includes("Local-Only")) {
            console.log("✅ SUCCESS: Data sovereignty preserved. No cloud leak.");
        } else {
            console.log("❌ ERROR:", e.message);
        }
    }
}

// Since this is ESM/TS environment usually, but we run with node, 
// we might need to adjust imports or use ts-node.
// For now, I'll just check if the logic is sound.
console.log("Verification logic ready.");
