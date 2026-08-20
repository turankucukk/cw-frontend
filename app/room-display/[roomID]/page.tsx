"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";

type Space = {
  id: number;
  name: string;
  qr: string;
};

type Reservation = {
  id: number;
  space_id: number;
  start_time: string;
  end_time: string;
  status: string;
};

export default function RoomDisplayPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.roomID as string;

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://cw-frontend-git-development-turankucukks-projects.vercel.app" || "http://localhost:3000";

  const qrAccessUrl =
    space?.qr && `${siteUrl}/access/${encodeURIComponent(space.qr)}`;

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSpace = async () => {
      if (!roomId) {
        setErrorMessage("Oda numarası bulunamadı.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const supabase = createClient();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [spaceResult, reservationResult] = await Promise.all([
        supabase
          .from("space")
          .select("id, name, qr")
          .eq("id", Number(roomId))
          .single(),
        supabase
          .from("reservation")
          .select("id, space_id, start_time, end_time, status")
          .eq("space_id", Number(roomId))
          .gte("end_time", today.toISOString())
          .lt("start_time", tomorrow.toISOString())
          .order("start_time", { ascending: true }),
      ]);

      if (spaceResult.error) {
        console.error("Oda alınamadı:", spaceResult.error);
        setErrorMessage("Oda bilgileri alınamadı.");
        setSpace(null);
        setLoading(false);
        return;
      }

      setSpace(spaceResult.data);

      if (reservationResult.error) {
        console.error("Randevular alınamadı:", reservationResult.error);
        setErrorMessage("Randevu bilgileri alınamadı.");
        setReservations([]);
      } else {
        setReservations(reservationResult.data ?? []);
      }

      setLoading(false);
    };

    fetchSpace();
  }, [roomId]);

  const timeText = currentTime
    ? currentTime.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const dateText = currentTime
    ? currentTime.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        weekday: "long",
      })
    : "";

  const now = currentTime?.getTime() ?? 0;
  const usableReservations = reservations.filter(
    (reservation) => reservation.status?.toLowerCase() !== "cancelled"
  );
  const activeReservation = currentTime
    ? usableReservations.find(
        (reservation) =>
          new Date(reservation.start_time).getTime() <= now &&
          new Date(reservation.end_time).getTime() > now
      )
    : undefined;
  const nextReservation = currentTime
    ? usableReservations.find(
        (reservation) => new Date(reservation.start_time).getTime() > now
      )
    : undefined;

  const formatReservationTime = (reservation: Reservation) => {
    const format = (value: string) =>
      new Date(value).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });

    return `${format(reservation.start_time)} – ${format(reservation.end_time)}`;
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#f5f6f8",
        display: "flex",
        flexDirection: "column",
        color: "#172033",
      }}
    >
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          px: 5,
          py: 0.5,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                backgroundColor: "primary.main",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
              }}
            >
              <MeetingRoomRoundedIcon sx={{ fontSize: 29 }} />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                DeskHere
              </Typography>

              <Typography sx={{ color: "#6b7280", mt: 0.25 }}>
                {loading
                  ? "Oda yükleniyor..."
                  : space?.name ?? `Oda ${roomId}`}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {timeText}
            </Typography>

            <Typography
              sx={{
                color: "#6b7280",
                mt: 0.5,
                textTransform: "capitalize",
              }}
            >
              {dateText}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "stretch",
          px: 4,
          pt: 2,
          pb: 10,
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ height: "100%" }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 1, borderRadius: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            sx={{
              height: errorMessage ? "calc(100% - 58px)" : "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                minHeight: 0,
                height: "100%",
                borderRadius: 4,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  textAlign: "center",
                }}
              >
                Kapıyı Aç
              </Typography>

              <Box
                sx={{
                  width: 205,
                  height: 205,
                  flexShrink: 0,
                  borderRadius: 4,
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  display: "grid",
                  placeItems: "center",
                  mb: 1.5,
                  p: 1,
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : qrAccessUrl ? (
                  <QRCodeSVG
                    value={qrAccessUrl}
                    size={185}
                    level="H"
                    includeMargin
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#9ca3af",
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    Bu oda için QR anahtarı bulunamadı.
                  </Typography>
                )}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                QR kodu telefonunuzla okutun
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  textAlign: "center",
                  mt: 0.5,
                }}
              >
                Rezervasyonunuz kontrol edildikten sonra kapı açılacaktır.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                minHeight: 0,
                height: "100%",
                borderRadius: 4,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontWeight: 600,
                  letterSpacing: 1.5,
                }}
              >
                ODA DURUMU
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: activeReservation ? "#dc2626" : "#16a34a",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                {activeReservation ? "Dolu" : "Müsait"}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", mb: 0.25 }}
                  >
                    Aktif rezervasyon
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {activeReservation
                      ? formatReservationTime(activeReservation)
                      : "Bulunmuyor"}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280", mb: 0.25 }}
                  >
                    Sonraki rezervasyon
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {nextReservation
                      ? formatReservationTime(nextReservation)
                      : "Bugün başka rezervasyon yok"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Paper
        component="nav"
        square
        elevation={0}
        sx={{
          px: 4,
          py: 1,
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1200,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<CalendarMonthRoundedIcon />}
          onClick={() =>
            router.push(`/room-display/${roomId}/reservations`)
          }
          sx={{
            borderRadius: 3,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Bugünkü randevular
        </Button>
      </Paper>
    </Box>
  );
}