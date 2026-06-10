import { prisma } from '@/lib/db';
import { internalLogSystemEvent } from './log-service';

/**
 * Omnichannel Alert System
 * Mô phỏng một Message Queue bất đồng bộ để gửi tin nhắn ra Zalo/Telegram.
 */

interface AlertPayload {
    channel: 'TELEGRAM' | 'ZALO' | 'APP';
    chatId?: string;
    message: string;
}

// Queue in-memory đơn giản thay thế Redis cho PoC
const alertQueue: AlertPayload[] = [];
let isProcessingQueue = false;

export const queueAlert = async (payload: AlertPayload) => {
    alertQueue.push(payload);
    
    // Trigger xử lý queue ở background (Không block request chính)
    if (!isProcessingQueue) {
        processQueue();
    }
};

const processQueue = async () => {
    isProcessingQueue = true;
    
    while (alertQueue.length > 0) {
        const payload = alertQueue.shift();
        if (!payload) continue;
        
        try {
            // Giả lập độ trễ mạng (Network latency) khi gọi API của Zalo/Telegram
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // TODO: Tại đây sẽ gọi API HTTP thực tế tới Zalo OA hoặc Telegram Bot
            // VD: fetch('https://api.telegram.org/bot<token>/sendMessage', ...)
            console.log(`[ALERT] Sent to ${payload.channel}: ${payload.message}`);
            
            // Ghi log vào Database
            await prisma.notificationLog.create({
                data: {
                    channel: payload.channel,
                    chatId: payload.chatId,
                    message: payload.message,
                    status: 'SENT'
                }
            });
            
        } catch (error: any) {
            console.error(`[ALERT ERROR] Failed to send to ${payload.channel}:`, error);
            
            await prisma.notificationLog.create({
                data: {
                    channel: payload.channel,
                    chatId: payload.chatId,
                    message: payload.message,
                    status: 'FAILED'
                }
            });
            await internalLogSystemEvent('ALERT_FAILED', 'ERROR', error.message);
        }
    }
    
    isProcessingQueue = false;
};

// Hàm tiện ích để gửi cảnh báo khẩn cấp (Critical DNF)
export const sendCriticalAlert = async (dnfCode: string, location: string, description: string) => {
    const msg = `🚨 [HURC1 KHẨN CẤP] Sự cố Critical tại ${location}.\nMã: ${dnfCode}\nChi tiết: ${description}`;
    
    // Gửi đồng thời đa kênh
    await queueAlert({ channel: 'TELEGRAM', chatId: '-100123456789', message: msg });
    await queueAlert({ channel: 'ZALO', chatId: 'zalo_oa_group_id', message: msg });
};
