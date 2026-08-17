// src/components/checkin/QRScanner.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography } from '@mui/material';

interface Props {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    let cancelled = false;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (cancelled) return;

        if (!devices || devices.length === 0) {
          setError('Kamera bulunamadı.');
          return;
        }

        // Arka kamerayı isimden bulmayı dene, yoksa ilkini kullan
        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('arka')
        );
        const cameraId = backCamera ? backCamera.id : devices[0].id;

        return scanner.start(
          cameraId,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (cancelled) return;
            isRunningRef.current = false;
            scanner.stop().catch(() => {});
            onScan(decodedText);
          },
          undefined
        );
      })
      .then(() => {
        if (!cancelled) isRunningRef.current = true;
      })
      .catch((err) => {
        console.error('Kamera başlatılamadı:', err);
        setError('Kamera başlatılamadı. Kamera izni verildiğinden emin olun.');
      });

    return () => {
      cancelled = true;
      if (isRunningRef.current) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
        isRunningRef.current = false;
      }
    };
  }, [onScan]);

  return (
    <Box>
      <Box id="qr-reader" sx={{ width: '100%', maxWidth: 400, mx: 'auto' }} />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}