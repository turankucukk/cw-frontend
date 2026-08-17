"use client";

import Navbar from "@/src/components/layout/Navbar";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    Chip,
    Collapse,
    Container,
    TextField,
    Snackbar,
    Alert,
    Typography,
} from "@mui/material";

type Reservation = {
    id: number;
    userId: number;
    spaceId: number;
    spaceName: string;
    buildingName: string;
    startTime: string;
    endTime: string;
    complaint: string;
    issueId: number | null;
};

export default function ComplaintsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const [texts, setTexts] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "warning" | "info",
    });

    const supabase = createClient();

    useEffect(() => {
        getReservations();
    }, []);

    const getReservations = async () => {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
            setLoading(false);
            return;
        }

        const { data: user } = await supabase
            .from("user")
            .select("id")
            .eq("user_id", authUser.id)
            .single();

        if (!user) {
            setLoading(false);
            return;
        }

        const { data: reservationData } = await supabase
            .from("reservation")
            .select("id, user_id, space_id, start_time, end_time, door_opened")
            .eq("user_id", user.id)
            .lte("start_time", new Date().toISOString())
            .eq("door_opened", true)
            .order("start_time", { ascending: false });

        if (!reservationData) {
            setLoading(false);
            return;
        }

        const result = await Promise.all(
            reservationData.map(async (reservation) => {
                const { data: space } = await supabase
                    .from("space")
                    .select("name, building_id")
                    .eq("id", reservation.space_id)
                    .single();

                const { data: building } = await supabase
                    .from("building")
                    .select("name")
                    .eq("id", space?.building_id)
                    .single();

                const { data: issue } = await supabase
                    .from("issue")
                    .select("id, description")
                    .eq("reservation_id", reservation.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                return {
                    id: reservation.id,
                    userId: user.id,
                    spaceId: reservation.space_id,
                    spaceName: space?.name ?? "Alan",
                    buildingName: building?.name ?? "Bina",
                    startTime: reservation.start_time,
                    endTime: reservation.end_time,
                    complaint: issue?.description ?? "",
                    issueId: issue?.id ?? null,
                };
            })
        );

        setReservations(result);

        setTexts(
            Object.fromEntries(
                result.map((reservation) => [
                    reservation.id,
                    reservation.complaint,
                ])
            )
        );

        setLoading(false);
    };

    const saveComplaint = async (reservation: Reservation) => {
        const complaint = texts[reservation.id]?.trim();

        if (!complaint) {
            alert("Lütfen bir şikâyet yazın.");
            return;
        }

        if (reservation.issueId) { // Mevcut şikâyeti güncelleme kısmı
            const { error } = await supabase
                .from("issue")
                .update({
                    description: complaint,
                })
                .eq("id", reservation.issueId);

            if (error) {
                console.error("Güncelleme hatası:", error);
                alert(`Şikâyet güncellenemedi: ${error.message}`);
                return;
            }
        } else {// Yeni şikâyet oluşturma kısmı
            const { error } = await supabase.from("issue").insert({
                user_id: reservation.userId,
                space_id: reservation.spaceId,
                reservation_id: reservation.id,
                description: complaint,
            });

            if (error) {
                console.error("Ekleme hatası:", error);
                alert(`Şikâyet kaydedilemedi: ${error.message}`);
                return;
            }
        }

        setSnackbar({
            open: true,
            message: reservation.issueId
                ? "Şikâyet başarıyla güncellendi."
                : "Şikâyet başarıyla gönderildi.",
            severity: "success",
        });
        await getReservations();
    };
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("tr-TR");

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    minHeight: "100vh",
                    pt: "110px",
                    pb: 5,
                    backgroundColor: "#f5f6f8",
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: "center", mb: 5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 600 }}>
                            ŞİKAYETLERİM
                        </Typography>

                        <Typography sx={{ color: "#6b7280" }}>
                            Rezervasyon başladıktan ve odaya giriş yaptıktan sonra şikayetinizi yazabilirsiniz.
                        </Typography>
                    </Box>

                    {loading && (
                        <Typography sx={{ textAlign: "center" }}>
                            Rezervasyonlar yükleniyor...
                        </Typography>
                    )}

                    {!loading && reservations.length === 0 && (
                        <Typography sx={{ textAlign: "center" }}>
                            Geçmiş rezervasyon bulunamadı.
                        </Typography>
                    )}

                    {reservations.map((reservation) => {
                        const isOpen = openId === reservation.id;
                        const text = texts[reservation.id] ?? "";

                        return (
                            <Card
                                key={reservation.id}
                                sx={{
                                    mb: 2,
                                    borderRadius: 3,
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    onClick={() =>
                                        setOpenId(isOpen ? null : reservation.id)
                                    }
                                    sx={{
                                        p: 2.5,
                                        cursor: "pointer",
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {reservation.spaceName}
                                        </Typography>

                                        <Typography color="text.secondary">
                                            {reservation.buildingName}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(reservation.startTime)} |{" "}
                                            {formatTime(reservation.startTime)} –{" "}
                                            {formatTime(reservation.endTime)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        {reservation.issueId && (
                                            <Chip
                                                label="Şikayet Alındı"
                                                color="primary"
                                                size="small"
                                            />
                                        )}

                                        <Typography sx={{ color: "#2563eb", fontWeight: 700 }}>
                                            {isOpen ? "▲" : "▼"}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Collapse in={isOpen}>
                                    <Box
                                        sx={{
                                            p: 2.5,
                                            backgroundColor: "#f9fafb",
                                        }}
                                    >
                                        <TextField
                                            value={text}
                                            onChange={(event) =>
                                                setTexts({
                                                    ...texts,
                                                    [reservation.id]: event.target.value,
                                                })
                                            }
                                            placeholder="Şikayetinizi yazın..."
                                            multiline
                                            minRows={4}
                                            fullWidth
                                            slotProps={{
                                                htmlInput: { maxLength: 500 },
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                mt: 1,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography variant="caption">
                                                {text.length}/500
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                disabled={!text.trim()}
                                                onClick={() => saveComplaint(reservation)}
                                            >
                                                {reservation.issueId
                                                    ? "Değişiklikleri Kaydet"
                                                    : "Şikayeti Gönder"}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </Card>
                        );
                    })}
                </Container>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false,
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false,
                        }))
                    }
                    sx={{
                        width: "100%",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}