"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { createClient } from "@/src/utils/supabase/client";
import dayjs from "dayjs";

export default function QrCheckPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [status, setStatus] = useState<"loading" | "granted" | "denied" | "no-auth">("loading");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createClient();

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setStatus("no-auth");
        return;
      }

      const { data: dbUser } = await supabase
        .from("user")
        .select("id")
        .eq("user_id", authUser.id)
        .single();

      if (!dbUser) {
        setStatus("no-auth");
        return;
      }

      const { data: room } = await supabase
        .from("space")
        .select("name")
        .eq("id", roomId)
        .single();

      setRoomName(room?.name ?? "Oda");

      const now = dayjs().toISOString();
      const { data: reservation } = await supabase
        .from("reservation")
        .select("id")
        .eq("space_id", roomId)
        .eq("user_id", dbUser.id)
        .eq("status", "confirmed")
        .lte("start_time", now)
        .gte("end_time", now)
        .maybeSingle();

      setStatus(reservation ? "granted" : "denied");

      // ── Kapı açma tetikleyicisi (arkadaşınızın backend'i hazır olunca burayı dolduracaksınız) ──
      // if (reservation) {
      //   await fetch("https://donanim-backend-url/acila", {
      //     method: "POST",
      //     body: JSON.stringify({ roomId, reservationId: reservation.id }),
      //   });
      // }
    };

    checkAccess();
  }, [roomId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 3,
        textAlign: "center",
      }}
    >
      {status === "loading" && <CircularProgress size={48} />}

      {status === "no-auth" && (
        <>
          <Typography variant="h6">Giriş yapmanız gerekiyor</Typography>
          <Button variant="contained" onClick={() => router.push(`/login?redirectedFrom=/qr/${roomId}`)}>
            Giriş Yap
          </Button>
        </>
      )}

      {status === "granted" && (
        <>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#10b981" }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Erişim Onaylandı</Typography>
          <Typography color="text.secondary">{roomName} için rezervasyonunuz doğrulandı.</Typography>
        </>
      )}

      {status === "denied" && (
        <>
          <CancelIcon sx={{ fontSize: 80, color: "#ef4444" }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Erişim Reddedildi</Typography>
          <Typography color="text.secondary">
            {roomName} için şu anda geçerli bir rezervasyonunuz bulunmuyor.
          </Typography>
        </>
      )}
    </Box>
  );
}