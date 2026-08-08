"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import { createClient } from "@/src/utils/supabase/client";
import {
  getRoomById,
  type RoomDetails,
} from "@/src/lib/api/rooms";
import { Suspense } from "react";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = Number(searchParams.get("roomId"));
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const participants = Number(
    searchParams.get("participants") ?? "1"
  );

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId || !Number.isInteger(roomId)) {
        setError("Geçersiz oda.");
        setLoading(false);
        return;
      }

      try {
        const roomData = await getRoomById(roomId);

        if (!roomData) {
          setError("Oda bulunamadı.");
          return;
        }

        setRoom(roomData);
      } catch (err) {
        console.error("Oda bilgileri alınamadı:", err);
        setError("Oda bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const calculateTotalPrice = () => {
    if (!room || !start || !end) {
      return 0;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const durationMs =
      endDate.getTime() - startDate.getTime();

    const durationHours =
      durationMs / (1000 * 60 * 60);

    const hourlyPrice = room.price ?? 0;

    return Math.max(0, durationHours * hourlyPrice);
  };

  const totalPrice = calculateTotalPrice();

  const handlePayment = async () => {
    if (!room) {
      setError("Oda bilgileri bulunamadı.");
      return;
    }

    if (!start || !end) {
      setError("Rezervasyon tarih ve saat bilgileri eksik.");
      return;
    }

    if (
      !Number.isInteger(participants) ||
      participants < 1
    ) {
      setError("Katılımcı sayısı geçersiz.");
      return;
    }

    setPaying(true);
    setError("");

    const supabase = createClient();

    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "Auth hatası:",
          JSON.stringify(authError, null, 2)
        );

        setError("Kullanıcı bilgileri alınamadı.");
        setPaying(false);
        return;
      }

      if (!authUser) {
        setError(
          "Rezervasyon yapmak için giriş yapmalısınız."
        );
        setPaying(false);
        return;
      }

      const {
        data: dbUser,
        error: dbUserError,
      } = await supabase
        .from("user")
        .select("id")
        .eq("user_id", authUser.id)
        .single();

      if (dbUserError || !dbUser) {
        console.error(
          "Public user bulunamadı:",
          JSON.stringify(dbUserError, null, 2)
        );

        setError("Kullanıcı profiliniz bulunamadı.");
        setPaying(false);
        return;
      }

      const {
        data: conflicts,
        error: conflictError,
      } = await supabase
        .from("reservation")
        .select(
          "id, space_id, start_time, end_time, status"
        )
        .eq("space_id", room.id!)
        .lt("start_time", end)
        .gt("end_time", start)
        .neq("status", "cancelled");

      if (conflictError) {
        console.error(
          "Müsaitlik kontrol hatası:",
          JSON.stringify(conflictError, null, 2)
        );

        setError(
          `Oda müsaitliği kontrol edilemedi: ${conflictError.message}`
        );

        setPaying(false);
        return;
      }

      if (conflicts && conflicts.length > 0) {
        setError(
          "Seçtiğiniz saat aralığı artık müsait değil. Lütfen başka bir saat seçin."
        );

        setPaying(false);
        return;
      }

      const {
        data: reservation,
        error: reservationError,
      } = await supabase
        .from("reservation")
        .insert({
          user_id: dbUser.id,
          space_id: room.id,
          start_time: start,
          end_time: end,
          participant_count: participants,
          total_price: totalPrice,
          status: "confirmed",
        })
        .select()
        .single();

      if (reservationError) {
        console.error(
          "Rezervasyon oluşturma hatası:",
          JSON.stringify(
            reservationError,
            null,
            2
          )
        );

        setError(
          `Rezervasyon oluşturulamadı: ${reservationError.message}`
        );

        setPaying(false);
        return;
      }


      const { error: paymentError } = await supabase
        .from("payment")
        .insert({
          reservation_id: reservation.id,
          transactionID: `DEMO-${Date.now()}`,
          amount: totalPrice,
          status: "paid",
          paid_at: new Date().toISOString(),
          payment_method: "demo",
        });

      if (paymentError) {
        console.error(
          "Payment kayıt hatası:",
          JSON.stringify(paymentError, null, 2)
        );
        setError("Ödeme kaydedilemedi (Veritabanı yetki/RLS hatası olabilir).");
        setPaying(false);
        return;
      }

      console.log(
        "Rezervasyon başarıyla oluşturuldu:",
        reservation
      );

      router.push(
        `/rooms/${room.id}#weekly-calendar`
      );
    } catch (err) {
      console.error(
        "Ödeme / rezervasyon işlemi hatası:",
        err
      );

      setError(
        "İşlem sırasında beklenmeyen bir hata oluştu."
      );

      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f6f8",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 550,
          p: {
            xs: 3,
            md: 5,
          },
          borderRadius: "20px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Ödeme
        </Typography>

        <Typography
          sx={{
            color: "#666666",
            mb: 4,
          }}
        >
          Rezervasyon bilgilerinizi kontrol edin.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {room && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  color: "#777777",
                  fontSize: 14,
                }}
              >
                Oda
              </Typography>

              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {room.name}
              </Typography>
            </Box>

            {start && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: "#777777",
                    fontSize: 14,
                  }}
                >
                  Başlangıç
                </Typography>

                <Typography>
                  {new Date(start).toLocaleString(
                    "tr-TR",
                    {
                      dateStyle: "long",
                      timeStyle: "short",
                    }
                  )}
                </Typography>
              </Box>
            )}

            {end && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    color: "#777777",
                    fontSize: 14,
                  }}
                >
                  Bitiş
                </Typography>

                <Typography>
                  {new Date(end).toLocaleString(
                    "tr-TR",
                    {
                      dateStyle: "long",
                      timeStyle: "short",
                    }
                  )}
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  color: "#777777",
                  fontSize: 14,
                }}
              >
                Katılımcı Sayısı
              </Typography>

              <Typography>
                {participants} kişi
              </Typography>
            </Box>

            <Box
              sx={{
                borderTop: "1px solid #dddddd",
                borderBottom: "1px solid #dddddd",
                py: 3,
                mb: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 17,
                }}
              >
                Ödenecek Tutar
              </Typography>

              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {totalPrice > 0
                  ? `${totalPrice.toFixed(2)} ₺`
                  : "Ücretsiz"}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={paying}
              onClick={handlePayment}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: 17,
                fontWeight: 600,
                borderRadius: "10px",
                backgroundColor: "#175bb8",

                "&:hover": {
                  backgroundColor: "#104a99",
                },
              }}
            >
              {paying ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Ödemeyi Onayla"
              )}
            </Button>

            <Typography
              sx={{
                mt: 2,
                textAlign: "center",
                color: "#999999",
                fontSize: 12,
              }}
            >
              Demo ödeme sistemi — gerçek ödeme
              alınmamaktadır.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f6f8" }}>
        <CircularProgress />
      </Box>
    }>
      <PaymentContent />
    </Suspense>
  );
}