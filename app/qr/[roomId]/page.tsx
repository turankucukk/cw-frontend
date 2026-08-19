"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { createClient } from "@/src/utils/supabase/client";
import dayjs from "dayjs";

type AccessStatus =
  | "loading"
  | "granted"
  | "denied"
  | "no-auth"
  | "error";

// Şimdilik yalnızca bu odada çalışacak
const TEST_ROOM_ID = "55";

export default function QrCheckPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.roomId as string;

  const alreadyChecked = useRef(false);

  const [status, setStatus] =
    useState<AccessStatus>("loading");

  const [roomName, setRoomName] =
    useState("Oda");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    // Next.js geliştirme modunda işlemin iki kez
    // çalışmasını önler.
    if (alreadyChecked.current) {
      return;
    }

    alreadyChecked.current = true;

    const checkAccess = async () => {
      try {
        const supabase = createClient();

        // Yalnızca test odasına izin ver
        if (roomId !== TEST_ROOM_ID) {
          setMessage(
            "Bu QR kodu test odasına ait değil."
          );
          setStatus("denied");
          return;
        }

        // Giriş yapan Supabase Auth kullanıcısını bul
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setStatus("no-auth");
          return;
        }

        // Auth kullanıcısını public user tablosunda bul
        const {
          data: databaseUser,
          error: userError,
        } = await supabase
          .from("user")
          .select("id")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (userError) {
          console.error(
            "Kullanıcı sorgu hatası:",
            userError
          );

          setMessage(
            "Kullanıcı bilgisi kontrol edilemedi."
          );
          setStatus("error");
          return;
        }

        if (!databaseUser) {
          setStatus("no-auth");
          return;
        }

        // Odanın ismini al
        const {
          data: room,
          error: roomError,
        } = await supabase
          .from("space")
          .select("id, name")
          .eq("id", roomId)
          .maybeSingle();

        if (roomError || !room) {
          console.error(
            "Oda sorgu hatası:",
            roomError
          );

          setMessage("Test odası bulunamadı.");
          setStatus("error");
          return;
        }

        setRoomName(room.name ?? "Test Odası");

        const now = dayjs().toISOString();

        // Şu anda geçerli rezervasyonu kontrol et
        const {
          data: reservation,
          error: reservationError,
        } = await supabase
          .from("reservation")
          .select("id")
          .eq("space_id", roomId)
          .eq("user_id", databaseUser.id)
          .eq("status", "confirmed")
          .lte("start_time", now)
          .gte("end_time", now)
          .limit(1)
          .maybeSingle();

        if (reservationError) {
          console.error(
            "Rezervasyon sorgu hatası:",
            reservationError
          );

          setMessage(
            "Rezervasyon kontrol edilemedi."
          );
          setStatus("error");
          return;
        }

        if (!reservation) {
          setMessage(
            `${room.name} için şu anda geçerli ` +
              "bir rezervasyonunuz bulunmuyor."
          );
          setStatus("denied");
          return;
        }

        // Raspberry Pi'a basit açma sinyali gönder
        const {
          error: signalError,
        } = await supabase
          .from("space")
          .update({
            unlock_requested: true,
            unlock_requested_at: now,
          })
          .eq("id", roomId);

        if (signalError) {
          console.error(
            "Kapı sinyali hatası:",
            signalError
          );

          setMessage(
            "Kapı açma sinyali gönderilemedi."
          );
          setStatus("error");
          return;
        }

        // İlgili rezervasyonda kapının açıldığını işaretle
        const {
          error: doorOpenedError,
        } = await supabase
          .from("reservation")
          .update({
            door_opened: true,
          })
          .eq("id", reservation.id);

        if (doorOpenedError) {
          console.error(
            "door_opened güncelleme hatası:",
            doorOpenedError
          );
        }

        setMessage("Kapı açma sinyali gönderildi.");
        setStatus("granted");
      } catch (error) {
        console.error(
          "Kapı kontrol hatası:",
          error
        );

        setMessage(
          "Supabase bağlantısı sırasında hata oluştu."
        );
        setStatus("error");
      }
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
      {status === "loading" && (
        <>
          <CircularProgress size={48} />

          <Typography color="text.secondary">
            Rezervasyonunuz kontrol ediliyor...
          </Typography>
        </>
      )}

      {status === "no-auth" && (
        <>
          <Typography variant="h6">
            Giriş yapmanız gerekiyor
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              router.push(
                `/login?redirectedFrom=/qr/${roomId}`
              )
            }
          >
            Giriş Yap
          </Button>
        </>
      )}

      {status === "granted" && (
        <>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "#10b981",
            }}
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Erişim Onaylandı
          </Typography>

          <Typography color="text.secondary">
            {roomName} için rezervasyonunuz
            doğrulandı. Kapı açılıyor.
          </Typography>
        </>
      )}

      {(status === "denied" ||
        status === "error") && (
        <>
          <CancelIcon
            sx={{
              fontSize: 80,
              color: "#ef4444",
            }}
          />

          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Erişim Reddedildi
          </Typography>

          <Typography color="text.secondary">
            {message}
          </Typography>
        </>
      )}
    </Box>
  );
}