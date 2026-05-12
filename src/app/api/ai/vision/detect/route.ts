import { NextRequest, NextResponse } from 'next/server';
import { detectObjects } from '@/lib/services/ai/manager';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Call our unified detection service (which priorities the local YOLO service)
        const result = await detectObjects(buffer, { useLocal: true });
        
        if (!result) {
            return NextResponse.json({ 
                error: 'YOLO Detection failed. Dịch vụ AI Vision (Docker container "yolo-service") không khả dụng. Đang chuyển sang dự phòng...' 
            }, { status: 503 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('API Vision Detect Error:', error);
        return NextResponse.json({ 
            error: `Máy chủ AI gặp sự cố: ${error.message || 'Unknown server error'}` 
        }, { status: 500 });
    }
}
