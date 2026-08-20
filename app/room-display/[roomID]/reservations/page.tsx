"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import {
    Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button,
    Chip, CircularProgress, Container, Paper, Stack, Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";

type Space = { id: number; name: string };
type Reservation = {
    id: number;
    startTime: string;
    endTime: string;
    status: string | null;
};

const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit",
    });

function statusInfo(status: string | null) {
    switch (status?.toLowerCase()) {
        case "confirmed": return { label: "Onaylandı", color: "success" as const };
        case "completed": return { label: "Tamamlandı", color: "info" as const };
        case "cancelled":
        case "canceled": return { label: "İptal edildi", color: "error" as const };
        case "pending": return { label: "Bekliyor", color: "warning" as const };
        default: return { label: status || "Belirtilmedi", color: "default" as const };
    }
}

export default function RoomReservationsPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomID as string;
    const [now, setNow] = useState(new Date());
    const [space, setSpace] = useState<Space | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!roomId) return;
            setLoading(true);
            setErrorMessage("");

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const supabase = createClient();

            const [spaceResult, reservationResult] = await Promise.all([
                supabase
                    .from("space")
                    .select("id, name")
                    .eq("id", Number(roomId))
                    .single(),

                supabase
                    .from("reservation")
                    .select("id, start_time, end_time, status")
                    .eq("space_id", Number(roomId))
                    .gte("start_time", today.toISOString())
                    .lt("start_time", tomorrow.toISOString())
                    .order("start_time", { ascending: true }),
            ]);

            if (spaceResult.error) {
                console.error("Oda bilgisi alınamadı:", spaceResult.error);
            } else {
                setSpace(spaceResult.data);
            }

            if (reservationResult.error) {
                console.error("Randevular alınamadı:", reservationResult.error);
                setErrorMessage("Bugünkü randevular alınamadı.");
                setReservations([]);
            } else {
                setReservations(
                    (reservationResult.data ?? []).map((reservation) => ({
                        id: reservation.id,
                        startTime: reservation.start_time,
                        endTime: reservation.end_time,
                        status: reservation.status,
                    }))
                );
            }
            setLoading(false);
        };
        fetchData();
    }, [roomId]);

    const timeText = now.toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const dateText = now.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        weekday: "long",
    });

    // BURAYA EKLE
    const START_HOUR = 8;
    const END_HOUR = 22;

    const timeSlots = Array.from(
        { length: END_HOUR - START_HOUR },
        (_, index) => {
            const startHour = START_HOUR + index;

            return {
                startHour,
                label: `${String(startHour).padStart(2, "0")}:00 – ${String(
                    startHour + 1
                ).padStart(2, "0")}:00`,
            };
        }
    );

    return (
        <Box sx={{ height: "100dvh", overflow: "hidden", bgcolor: "#f5f6f8", display: "flex", flexDirection: "column", color: "#172033" }}>
            <Box component="header" sx={{ flexShrink: 0, px: 5, py: 0.5, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,.06)", zIndex: 2 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", columnGap: 2, alignItems: "center" }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center" }}>
                            <MeetingRoomRoundedIcon sx={{ fontSize: 29 }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, lineHeight: 1.1 }}>DeskHere</Typography>
                            <Typography sx={{ color: "#6b7280", mt: 0.25 }}>{space?.name ?? `Oda ${roomId}`}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1 }}>{timeText}</Typography>
                        <Typography sx={{ color: "#6b7280", mt: 0.5, textTransform: "capitalize" }}>{dateText}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box component="main" sx={{ flex: 1, minHeight: 0, px: 4, py: 2, overflow: "hidden" }}>
                <Container maxWidth="md" sx={{ height: "100%" }}>
                    <Paper elevation={0} sx={{ height: "100%", minHeight: 0, borderRadius: 4, px: 3, py: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,.06)", display: "flex", flexDirection: "column" }}>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: "center" }}>
                            <CalendarMonthRoundedIcon color="primary" />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>Bugünkü Randevular</Typography>
                                <Typography variant="body2" sx={{ color: "#6b7280" }}>{space?.name ?? `Oda ${roomId}`}</Typography>
                            </Box>
                        </Stack>

                        {errorMessage && <Alert severity="error" sx={{ mb: 1.5 }}>{errorMessage}</Alert>}

                        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
                            {loading ? (
                                <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}><CircularProgress /></Box>
                            ) : reservations.length === 0 ? (
                                <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
                                    <Typography sx={{ color: "#6b7280" }}>Bu oda için bugün randevu bulunmuyor.</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={1}>
                                    {reservations.map((reservation) => {
                                        const info = statusInfo(reservation.status);
                                        return (
                                            <Paper
                                                key={reservation.id}
                                                elevation={0}
                                                sx={{
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: 3,
                                                    px: 2.5,
                                                    py: 1.75,
                                                }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    sx={{
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={{ alignItems: "center" }}
                                                    >
                                                        <AccessTimeRoundedIcon color="primary" />

                                                        <Typography sx={{ fontWeight: 700 }}>
                                                            {formatTime(reservation.startTime)} –{" "}
                                                            {formatTime(reservation.endTime)}
                                                        </Typography>
                                                    </Stack>

                                                    <Chip
                                                        size="small"
                                                        label={info.label}
                                                        color={info.color}
                                                    />
                                                </Stack>
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </Box>

            <Paper component="nav" square elevation={0} sx={{ flexShrink: 0, px: 4, py: 1, display: "flex", justifyContent: "center", bgcolor: "#fff", boxShadow: "0 -4px 12px rgba(0,0,0,.06)" }}>
                <Button onClick={() => router.push(`/room-display/${roomId}`)} variant="contained" size="large" startIcon={<ArrowBackRoundedIcon />} sx={{ borderRadius: 3, px: 3, textTransform: "none", fontWeight: 600 }}>
                    Oda ekranına dön
                </Button>
            </Paper>
        </Box>
    );
}