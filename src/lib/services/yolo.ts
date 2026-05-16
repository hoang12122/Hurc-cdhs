
export interface YoloDetection {
    box: [number, number, number, number]; // [x1, y1, x2, y2]
    label: string;
    confidence: number;
    class_id: number;
}

export interface YoloResponse {
    detections: YoloDetection[];
    count: number;
    image_size: {
        width: number;
        height: number;
    };
}

/**
 * Communicates with the 'yolo-service' Docker container to perform object detection.
 */
export async function detectObjects(imageBuffer: Buffer): Promise<YoloResponse | null> {
    const YOLO_SERVICE_URL = process.env.YOLO_SERVICE_URL || 'http://yolo-service:5005/detect';

    try {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' });
        formData.append('file', blob, 'image.jpg');

        const response = await fetch(YOLO_SERVICE_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`YOLO Service responded with ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling YOLO Service:', error);
        return null;
    }
}

/**
 * Calculates Intersection Over Union (IoU) for two bounding boxes.
 * Requested as part of the Yolo AI upgrade plan.
 */
export function calculateIoU(boxA: number[], boxB: number[]): number {
    const xA = Math.max(boxA[0], boxB[0]);
    const yA = Math.max(boxA[1], boxB[1]);
    const xB = Math.min(boxA[2], boxB[2]);
    const yB = Math.min(boxA[3], boxB[3]);

    const interArea = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);
    const boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1);
    const boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1);

    const iou = interArea / (boxAArea + boxBArea - interArea);
    return iou;
}
