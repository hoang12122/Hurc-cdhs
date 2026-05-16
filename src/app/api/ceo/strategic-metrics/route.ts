import { NextResponse } from 'next/server';
import { calculateStrategicScorecard, generateCEOInsights } from '@/lib/services/strategic-metrics';
import { generateWeeklyCeoReport } from '@/lib/services/report-service';

export async function GET() {
    try {
        const scorecard = await calculateStrategicScorecard();
        
        // Chỉ gọi AI Insights nếu cần thiết để tối ưu hiệu suất
        // Trong môi trường production thực tế, ta có thể cache kết quả này
        const insights = await generateCEOInsights(scorecard);
        
        return NextResponse.json({
            ...scorecard,
            insights
        });
    } catch (error: any) {
        console.error("CEO API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST() {
    try {
        const result = await generateWeeklyCeoReport();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("CEO Report API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
