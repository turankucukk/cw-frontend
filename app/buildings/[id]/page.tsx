"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import { Alert, Box, Button, Chip, CircularProgress, Container, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import RoomList from "@/src/components/rooms/RoomList";
import { getBuildingById, type Building } from "@/src/lib/api/building";
import { getRooms, type Room } from "@/src/lib/api/rooms";
import { formatFloor } from "@/src/lib/formatFloor";

export default function BuildingRoomsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const buildingId = Number(params.id);

  const [building, setBuilding] = useState<Building | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!Number.isInteger(buildingId)) {
        setError("Geçersiz bina numarası.");
        setLoading(false);
        return;
      }

      const [buildingData, allRooms] = await Promise.all([
        getBuildingById(buildingId),
        getRooms(),
      ]);

      if (!buildingData) {
        setError("Bina bulunamadı.");
        setLoading(false);
        return;
      }

      setBuilding(buildingData);
      setRooms(allRooms.filter((room) => room.building_id === buildingId));
      setLoading(false);
    };

    fetchData();
  }, [buildingId]);

  const floors = useMemo(() => {
    const unique = Array.from(new Set(rooms.map((r) => r.floor).filter(Boolean))) as string[];
    return unique.sort((a, b) => Number(a) - Number(b));
  }, [rooms]);

  const displayedRooms = selectedFloor
    ? rooms.filter((r) => r.floor === selectedFloor)
    : rooms;

  return (
    <>
      <Navbar />

      <Box sx={{ pt: { xs: 14, md: 16 }, pb: 6, minHeight: "100vh", bgcolor: "#f5f6f8" }}>
        <Container maxWidth="lg">
          <Button onClick={() => router.push("/buildings")} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Binalar
          </Button>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && (error || !building) && <Alert severity="error">{error || "Bina bulunamadı."}</Alert>}

          {!loading && building && (
            <>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {building.name}
                </Typography>
                <Typography color="text.secondary">
                  Görmek istediğiniz odayı aşağıdan seçin.
                </Typography>
              </Box>

              {floors.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap" }} useFlexGap>
                  <Chip
                    label="Tüm Katlar"
                    color={selectedFloor === null ? "primary" : "default"}
                    onClick={() => setSelectedFloor(null)}
                  />
                  {floors.map((floor) => (
                    <Chip
                      key={floor}
                      label={formatFloor(floor)}
                      color={selectedFloor === floor ? "primary" : "default"}
                      onClick={() => setSelectedFloor(floor)}
                    />
                  ))}
                </Stack>
              )}

              <RoomList rooms={displayedRooms} selectedBuildingId={buildingId} />
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}