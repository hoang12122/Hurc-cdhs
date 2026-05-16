import { NextRequest, NextResponse } from "next/server";
import { internalLogSystemEvent as logSystemEvent } from "@/lib/services/log-service";
import { requireAuth } from "@/lib/auth-enforcer";
import { askAI } from "@/lib/services/ai/manager";

const SYSTEM_PROMPT = `
Bạn là một trợ lý AI thông minh, chuyên trích xuất thông tin kỹ thuật từ các ghi âm của kỹ sư bảo trì.
Nhiệm vụ: Trích xuất các thông tin sau từ đoạn văn bản người dùng cung cấp và trả về DUY NHẤT một đối tượng JSON hợp lệ (không có markdown formatting, không có markdown code blocks, chỉ trả về chuỗi JSON raw có thể parse bằng JSON.parse).

Các trường cần trích xuất (nếu không rõ, hãy để chuỗi rỗng ""):
- title (string): Tiêu đề ngắn gọn của vấn đề/cải tiến.
- description (string): Mô tả chi tiết vấn đề.
- category (string): Phân loại (SAFETY, PERFORMANCE, COST_SAVING, OTHER). Mặc định là OTHER nếu không rõ.
- benefitAnalysis (string): Phân tích lợi ích mang lại.
- estimatedCost (number): Ước tính chi phí (nếu có nhắc đến tiền, hãy trích xuất con số, nếu không trả về 0).

Ví dụ dữ liệu đầu vào: "Hôm nay tôi kiểm tra hệ thống làm mát tủ điện L3 thấy quạt tản nhiệt bị hỏng, cần phải thay thế quạt mới để đảm bảo an toàn cháy nổ, chi phí ước tính khoảng 5 triệu đồng, việc này giúp tránh hỏng hóc toàn bộ hệ thống trị giá hàng tỷ đồng."
Ví dụ Output (JSON):
{
  "title": "Thay thế quạt tản nhiệt tủ điện L3",
  "description": "Quạt tản nhiệt bị hỏng, nguy cơ gây mất an toàn cháy nổ cho hệ thống.",
  "category": "SAFETY",
  "benefitAnalysis": "Tránh hỏng hóc toàn bộ hệ thống tủ điện L3 do quá nhiệt.",
  "estimatedCost": 5000000
}
`;

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Call existing AI manager
    const aiResponse = await askAI(`Văn bản ghi âm: "${text}"`, { 
        systemPrompt: SYSTEM_PROMPT,
        forceBackend: "gemini" // Using gemini or let it fallback naturally
    });
    
    let parsedData = {};
    try {
      // Clean potential markdown blocks like ```json ... ```
      const cleanJson = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Could not parse AI response as JSON:", aiResponse);
      // Fallback if parsing fails
      parsedData = {
        title: "Trích xuất từ AI (cần xem lại)",
        description: text,
        category: "OTHER",
        benefitAnalysis: "",
        estimatedCost: 0
      };
    }
    
    await logSystemEvent(
      "AI_SPEECH_PARSE", 
      "INFO", 
      `Parsed speech to JSON successfully.`,
      "ai"
    );

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("[AI Speech Parse API Error]:", error);
    await logSystemEvent("AI_SPEECH_ERROR", "ERROR", error.message, "ai");
    return NextResponse.json({ error: error.message || "Failed to parse speech" }, { status: 500 });
  }
}
