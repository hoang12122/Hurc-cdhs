import { extractEntityIds, extractAttributesForId, auditResponse, generateSafeFallbackResponse, runReflectionLoop } from '../src/lib/services/ai/anti-hallucination';

async function runTests() {
    console.log("=== STARTING ANTI-HALLUCINATION TEST SUITE ===");
    
    // Test 1: ID Extraction
    const sampleText = "Chúng tôi tìm thấy sự cố DNF-102 và HAZ-205, nhưng CA-309 chưa xử lý. Không có INS-901.";
    const ids = extractEntityIds(sampleText);
    console.log("\n[Test 1] Extracting IDs:");
    console.log("Input:", sampleText);
    console.log("Extracted IDs (expecting DNF-102, HAZ-205, CA-309, INS-901):", ids);
    
    // Test 2: Context Attribute Parsing
    const mockContext = `
## FAILURE REPORTS (DNF)
### Report ID: DNF-001-0001
- Status: Mới
- Priority: Cao
- Description: Lỗi hệ thống tín hiệu đường ray.

{
    "id": "HAZ-003-001",
    "status": "Đã đóng",
    "severityId": "I"
}
    `.trim();
    
    console.log("\n[Test 2] Extracting Attributes:");
    const attrsDnf = extractAttributesForId("DNF-001-0001", mockContext);
    console.log("DNF-001-0001 (expecting status: Mới, priority: Cao):", attrsDnf);
    
    const attrsHaz = extractAttributesForId("HAZ-003-001", mockContext);
    console.log("HAZ-003-001 (expecting status: Đã đóng):", attrsHaz);

    // Test 3: Audit Safe Response
    console.log("\n[Test 3] Auditing Safe Response:");
    const safeResult = await auditResponse(
        "Kiểm tra trạng thái DNF-001-0001?",
        "Sự cố DNF-001-0001 hiện có trạng thái là Mới và độ ưu tiên là Cao.",
        mockContext
    );
    console.log("Result (expecting isSafe: true):", safeResult);

    // Test 4: Audit Hallucinated ID
    console.log("\n[Test 4] Auditing Fake ID (Hallucination):");
    const fakeIdResult = await auditResponse(
        "Kiểm tra trạng thái DNF-001-0001?",
        "Sự cố DNF-001-0001 là Mới, nhưng sự cố DNF-999-9999 đã được đóng.",
        mockContext
    );
    console.log("Result (expecting isSafe: false, hallucinated ID):", fakeIdResult);

    // Test 5: Audit Attribute Contradiction
    console.log("\n[Test 5] Auditing Contradiction (Claiming closed when active):");
    const contradictionResult = await auditResponse(
        "Trạng thái của DNF-001-0001?",
        "Sự cố DNF-001-0001 đã được giải quyết hoàn toàn và đã đóng.",
        mockContext
    );
    console.log("Result (expecting isSafe: false, status mismatch):", contradictionResult);

    // Test 6: Audit False Refusal
    console.log("\n[Test 6] Auditing False Refusal (CSDL has info but AI says unknown):");
    const falseRefusalResult = await auditResponse(
        "Thông tin DNF-001-0001?",
        "Tôi không biết hoặc không tìm thấy dữ liệu liên quan đến sự cố này.",
        mockContext
    );
    console.log("Result (expecting isSafe: false, false refusal):", falseRefusalResult);

    // Test 7: Audit Missing Citation
    console.log("\n[Test 7] Auditing Missing Citation:");
    const missingCitationResult = await auditResponse(
        "Hãy báo cáo về DNF-001-0001?",
        "Hệ thống ghi nhận một sự cố mới ở đường ray cấp độ ưu tiên Cao.",
        mockContext
    );
    console.log("Result (expecting isSafe: false, missing citation):", missingCitationResult);

    // Test 8: Safe Fallback Generation
    console.log("\n[Test 8] Generating Safe Fallback Response:");
    const fallbackText = generateSafeFallbackResponse("Thông tin DNF-001-0001 và HAZ-003-001?", mockContext);
    console.log("Fallback Output:\n", fallbackText);
    
    // Test 9: Self-Reflection and Correction Loop (Simulating Flawed AI that corrects itself)
    console.log("\n[Test 9] Simulating AI Self-Correction Reflection Loop:");
    
    let simulatedCallCount = 0;
    const mockAskAI = async (promptText: string) => {
        simulatedCallCount++;
        console.log(`   -> [Simulated LLM] Called (Attempt ${simulatedCallCount})`);
        
        if (simulatedCallCount === 1) {
            // First answer contains status contradiction (claiming DNF-001-0001 is closed when it is actually new/active)
            return "Sự cố DNF-001-0001 đã được đóng thành công.";
        }
        
        // In the next attempt, after receiving audit feedback, simulated AI corrects itself
        console.log("   -> [Simulated LLM] Detected audit report in prompt. Correcting output...");
        return "Sự cố DNF-001-0001 có trạng thái thực tế là Mới và độ ưu tiên Cao.";
    };

    const finalCorrectedResult = await runReflectionLoop(
        "Trạng thái DNF-001-0001?",
        "Sự cố DNF-001-0001 đã được đóng thành công.", // initial flawed response
        mockContext,
        "System prompt",
        mockAskAI
    );
    console.log("Final Loop Result (expecting corrected answer):", finalCorrectedResult);
    console.log("Total LLM Calls:", simulatedCallCount);

    // Test 10: Reflection Loop Fallback (Simulating Stubborn AI that keeps hallucinating)
    console.log("\n[Test 10] Simulating AI Reflection Fallback (Stubborn AI):");
    
    let simulatedStubbornCallCount = 0;
    const mockStubbornAskAI = async (promptText: string) => {
        simulatedStubbornCallCount++;
        console.log(`   -> [Stubborn Simulated LLM] Called (Attempt ${simulatedStubbornCallCount})`);
        // Keep returning the flawed response despite feedback
        return "Sự cố DNF-001-0001 đã được đóng và giải quyết xong.";
    };

    const finalFallbackResult = await runReflectionLoop(
        "Trạng thái DNF-001-0001?",
        "Sự cố DNF-001-0001 đã được đóng và giải quyết xong.", // initial flawed response
        mockContext,
        "System prompt",
        mockStubbornAskAI
    );
    console.log("Final Loop Result (expecting Safe-Mode direct database retrieval):");
    console.log(finalFallbackResult);
    
    console.log("\n=== TEST SUITE COMPLETED ===");
}

runTests().catch(console.error);
