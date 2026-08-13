// src/components/checkin/CheckinModal.tsx
"use client";

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { verifyAccess, type VerifyAccessResult } from '@/src/lib/api/checkin';
import QRScanner from './QRSacnner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CheckinModal({ open, onClose }: Props) {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyAccessResult | null>(null);

  const handleScan = async (decodedText: string) => {
    setScanning(false);
    setLoading(true);

    const res = await verifyAccess(decodedText);

    setLoading(false);
    setResult(res);
  };

  const reset = () => {
    setResult(null);
    setScanning(true);
  };

  const handleClose = () => {
    setResult(null);
    setScanning(true);
    onClose();
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Kapı Girişi
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
        {scanning && <QRScanner onScan={handleScan} />}

        {loading && (
          <Box sx={{ py: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Doğrulanıyor...</Typography>
          </Box>
        )}

        {result && (
          <Box sx={{ py: 3 }}>
            {result.granted ? (
              <>
                <CheckCircleIcon color="success" sx={{ fontSize: 72 }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Kapı Açıldı</Typography>
                {result.roomName && (
                  <Typography sx={{ mt: 1 }}>{result.roomName}</Typography>
                )}
                {result.reservation && (
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(result.reservation.start_time)} - {formatTime(result.reservation.end_time)}
                  </Typography>
                )}
              </>
            ) : (
              <>
                <CancelIcon color="error" sx={{ fontSize: 72 }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Erişim Reddedildi</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>{result.reason}</Typography>
              </>
            )}
            <Button sx={{ mt: 3 }} variant="outlined" onClick={reset}>Tekrar Tara</Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}