"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import RoomLayoutEditor from "@/src/components/admin/RoomLayoutEditor";
import { getRoomById, type Room } from "@/src/lib/api/rooms";

export default function RoomLayoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roomId = Number(params.id);

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      if (!Number.isInteger(roomId)) {
        setError("Geçersiz oda numarası.");
        setLoading(false);
        return;
      }

      const roomData = await getRoomById(roomId);
      if (!roomData) {
        setError("Oda bulunamadı.");
        setLoading(false);
        return;
      }

      setRoom(roomData);
      setLoading(false);
    };

    fetchRoom();
  }, [roomId]);

  return (
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 4 } }}>
      <Button
        onClick={() => router.push("/admin/rooms")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Odalar
      </Button>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (error || !room) && <Alert severity="error">{error || "Oda bulunamadı."}</Alert>}

      {!loading && room && (
        <>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 3 }}>
            {room.name} — Kroki
          </Typography>
          <RoomLayoutEditor roomId={room.id!} initialLayout={room.layout_data} />
        </>
      )}
    </Container>
  );
}
