
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QrCode, CameraOff, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerDialogProps {
  onScan: (value: string) => void;
}

const translations = {
  vi: {
    scanQrCode: "Quét mã",
    scannerTitle: "Quét mã vạch hoặc mã QR",
    scannerDescription: "Hướng camera của bạn vào mã để quét tự động.",
    noCameraPermissionTitle: "Yêu cầu quyền truy cập Camera",
    noCameraPermissionDescription: "Vui lòng cho phép ứng dụng truy cập camera của bạn trong cài đặt trình duyệt để sử dụng tính năng này.",
    noBarcodeDetectorApi: "Trình duyệt của bạn không hỗ trợ tính năng quét mã. Vui lòng thử trên trình duyệt khác (như Chrome) hoặc nhập thủ công.",
    cancel: "Hủy",
    scanning: "Đang tìm mã...",
  },
  en: {
    scanQrCode: "Scan Code",
    scannerTitle: "Scan Barcode or QR Code",
    scannerDescription: "Point your camera at a code to scan it automatically.",
    noCameraPermissionTitle: "Camera Access Required",
    noCameraPermissionDescription: "Please allow camera access in your browser settings to use this feature.",
    noBarcodeDetectorApi: "Your browser does not support barcode scanning. Please try a different browser (like Chrome) or enter the code manually.",
    cancel: "Cancel",
    scanning: "Looking for a code...",
  },
};

export function BarcodeScannerDialog({ onScan }: BarcodeScannerDialogProps) {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);
  const [isApiSupported, setIsApiSupported] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  React.useEffect(() => {
    if (!('BarcodeDetector' in window)) {
      setIsApiSupported(false);
    }
  }, []);

  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startScan = React.useCallback(async () => {
    if (!videoRef.current || !isApiSupported) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const barcodeDetector = new (window as any).BarcodeDetector();
      const intervalId = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            onScan(barcodes[0].rawValue);
            setIsOpen(false); 
          }
        } catch (error) {
          console.error("Barcode detection error:", error);
        }
      }, 500);

      return () => clearInterval(intervalId);

    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
    }
  }, [onScan, isApiSupported]);

  React.useEffect(() => {
    let cleanup = () => {};
    if (isOpen) {
      startScan().then(cleaner => {
        if (cleaner) cleanup = cleaner;
      });
    } else {
      stopCamera();
    }
    return () => cleanup();
  }, [isOpen, startScan, stopCamera]);

  if (!isApiSupported) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => toast({ variant: "destructive", title: t.noBarcodeDetectorApi })}
        title={t.noBarcodeDetectorApi}
      >
        <QrCode className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button type="button" variant="outline" size="icon" onClick={() => setIsOpen(true)} title={t.scanQrCode}>
        <QrCode className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.scannerTitle}</DialogTitle>
          <DialogDescription>{t.scannerDescription}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
          {!hasCameraPermission && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t.noCameraPermissionTitle}</AlertTitle>
              <AlertDescription>{t.noCameraPermissionDescription}</AlertDescription>
            </Alert>
          )}
           {hasCameraPermission && (
             <p className="text-sm text-muted-foreground text-center mt-2">{t.scanning}</p>
           )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>{t.cancel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

