"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

import RoomGallery from "@/src/components/rooms/RoomGallery";
import WeeklyCalendar from "@/src/components/rooms/WeeklyCalendar";

import {
  getRoomById,
  type RoomDetails,
} from "../../../src/lib/api/rooms";

export default function RoomPage() {
  const params = useParams<{ id: string }>();

  const roomId = Number(params.id);

  const [room, setRoom] = useState<RoomDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      if (!Number.isInteger(roomId)) {
        setError("Geçersiz oda numarası.");
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
        console.error(err);
        setError("Oda bilgileri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !room) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">
          {error || "Oda bulunamadı."}
        </Alert>

        <Button
          href="/buildings"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ mt: 3 }}
        >
          Binalara dön
        </Button>
      </Container>
    );
  }

  const floorText =
    room.floor !== null
      ? String(room.floor)
          .toLocaleLowerCase("tr-TR")
          .includes("kat")
        ? String(room.floor)
        : `${room.floor}. Kat`
      : null;

  const locationText = [
    room.buildingName,
    floorText,
  ]
    .filter(Boolean)
    .join(" • ");

  const backUrl = room.buildingId
    ? `/buildings/${room.buildingId}`
    : "/buildings";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        pb: 8,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Button
          href={backUrl}
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mb: 3,
            color: "#171717",
            textTransform: "none",
            fontSize: 16,
          }}
        >
          Geri
        </Button>

        <RoomGallery
          images={room.images}
          roomName={room.name}
        />

        <Box
          sx={{
            py: {
              xs: 4,
              md: 5,
            },
            maxWidth: 1000,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: 38,
                md: 58,
              },
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            {room.name}
          </Typography>

          {locationText && (
            <Typography
              sx={{
                mt: 2,
                fontSize: 18,
                color: "#444444",
              }}
            >
              {locationText}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mt: 3,
            }}
          >
            <Chip
              icon={<GroupsRoundedIcon />}
              label={`${room.capacity} Kişi`}
              variant="outlined"
            />

            {room.type && (
              <Chip
                label={room.type}
                variant="outlined"
              />
            )}

            {room.features.map((feature) => (
              <Chip
                key={feature}
                label={feature}
                variant="outlined"
              />
            ))}
          </Box>

          {room.price > 0 && (
            <Typography
              sx={{
                mt: 3,
                fontSize: 19,
                fontWeight: 600,
              }}
            >
              {room.price} ₺ / saat
            </Typography>
          )}

          <Typography
            sx={{
              mt: 4,
              fontSize: 17,
              lineHeight: 1.8,
              color: "#333333",
            }}
          >
            {room.description ||
              "Bu oda için henüz açıklama eklenmemiş."}
          </Typography>
        </Box>

        <Box
          id="weekly-calendar"
          sx={{
            borderTop: "1px solid #e4e4e4",
            pt: 5,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: 28,
                md: 36,
              },
              fontWeight: 700,
              mb: 1,
            }}
          >
            Haftalık Takvim
          </Typography>

          <Typography
            sx={{
              color: "#666666",
              mb: 4,
            }}
          >
            Boş bir saate tıklayarak rezervasyon
            oluşturabilirsin.
          </Typography>

          <WeeklyCalendar roomId={room.id} />
        </Box>
      </Container>
    </Box>
  );
}