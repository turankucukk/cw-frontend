"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RoomLayoutViewer from "@/src/components/rooms/RoomLayoutViewer";
import RoomGallery from "@/src/components/rooms/RoomGallery";
import WeeklyCalendar from "@/src/components/rooms/WeeklyCalendar";
import RoomsSection from "@/src/components/rooms/RoomSection";

import {
  getRoomById,
  type RoomDetails,
} from "@/src/lib/api/rooms";

export default function RoomPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const roomId = Number(params.id);

  const [room, setRoom] = useState<RoomDetails | null>(null);
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

        if (!roomData.isActive) {
          setError(
            "Bu oda şu anda bakımda ve rezervasyona kapalıdır."
          );
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

  const handleClose = () => {
  router.back();
};

  const floorText =
    room && room.floor !== null
      ? String(room.floor)
          .toLocaleLowerCase("tr-TR")
          .includes("kat")
        ? String(room.floor)
        : `${room.floor}. Kat`
      : null;

  const locationText = room
    ? [room.building_id, floorText]
        .filter(Boolean)
        .join(" • ")
    : "";

  return (
    <>
      <RoomsSection />

      <Dialog
        open={true}
        onClose={handleClose}
        fullWidth
        maxWidth="xl"
        scroll="body"
      >
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Button
            onClick={handleClose}
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

          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!loading && (error || !room) && (
            <Alert severity="error">
              {error || "Oda bulunamadı."}
            </Alert>
          )}

          {!loading && room && (
            <>
              {room.needsApproval && (
                <Alert
                  severity="warning"
                  variant="filled"
                  sx={{
                    mb: 3,
                    fontSize: 16,
                    fontWeight: 600,
                    alignItems: "center",
                  }}
                >
                  Oda rezervasyonu için yönetici onayı gereklidir.
                </Alert>
              )}

              <RoomGallery
                images={(room.room_images ?? []).map(
                  (img) => img.image_url
                )}
                roomName={room.name}
              />

              <Box
                sx={{
                  py: { xs: 4, md: 5 },
                  maxWidth: 1000,
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 38, md: 58 },
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

                  {(room.features ?? []).map(
                    (feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        variant="outlined"
                      />
                    )
                  )}
                </Box>

                {(room.price ?? 0) > 0 && (
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

              {room.layout_data?.items &&
                room.layout_data.items.length > 0 && (
                  <Box
                    sx={{
                      borderTop:
                        "1px solid #e4e4e4",
                      pt: 5,
                      pb: 5,
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
                      Oda Krokisi
                    </Typography>

                    <Typography
                      sx={{
                        color: "#666666",
                        mb: 4,
                      }}
                    >
                      Toplantı salonunda nelerin nerede
                      olduğunu kuş bakışı görebilirsin.
                    </Typography>

                    <RoomLayoutViewer
                      layout={room.layout_data}
                    />
                  </Box>
                )}

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

                <WeeklyCalendar
  roomId={room.id!}
  roomCapacity={room.capacity}
  maintenanceStart={(room as any).maintenance_start ?? null}
  maintenanceEnd={(room as any).maintenance_end ?? null}
/>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
}