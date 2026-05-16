import { NextRequest, NextResponse } from "next/server";
import { internalLogSystemEvent as logSystemEvent } from "@/lib/services/log-service";
import { requireAuth } from "@/lib/auth-enforcer";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const aiWorkerUrl = process.env.AI_WORKER_URL || "http://localhost:8000";
    
    // Proxy formData to AI Worker
    const proxyFormData = new FormData();
    proxyFormData.append("file", file);

    const response = await fetch(`${aiWorkerUrl}/analyze`, {
      method: "POST",
      body: proxyFormData,
      // Note: Do NOT set Content-Type header manually when sending FormData in fetch
    });

    if (!response.ok) {
      throw new Error(`AI Worker responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    await logSystemEvent(
      "AI_VISION_ANALYZE", 
      "INFO", 
      `Analyzed image: ${file.name}. Found ${data.detections?.length || 0} objects.`,
      "ai"
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[AI Vision API Error]:", error);
    await logSystemEvent("AI_VISION_ERROR", "ERROR", error.message, "ai");
    return NextResponse.json({ error: error.message || "Failed to analyze image" }, { status: 500 });
  }
}
