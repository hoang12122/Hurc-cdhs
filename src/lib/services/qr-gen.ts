import QRCode from 'qrcode';

export async function generateAssetQR(assetId: string): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/metro/scan?id=${assetId}`;
    
    try {
        const qrDataUrl = await QRCode.toDataURL(qrUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
            color: {
                dark: '#1e293b', // slate-800
                light: '#ffffff'
            }
        });
        return qrDataUrl;
    } catch (err) {
        console.error('QR Generation Error:', err);
        throw err;
    }
}
