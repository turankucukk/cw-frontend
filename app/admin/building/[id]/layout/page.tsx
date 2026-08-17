"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BuildingLayoutEditor from "@/src/components/admin/BuildingLayoutEditor";
import { getBuildingById, type Building } from "@/src/lib/api/building";
import { getRooms, type Room } from "@/src/lib/api/rooms";

export default function BuildingLayoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const buildingId = Number(params.id);

  const [building, setBuilding] = useState<Building | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 4 } }}>
      <Button
        onClick={() => router.push("/admin/building")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
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
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
            {building.name} — Bina Krokisi
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Üstten kat seçin, sol taraftan odaları veya giriş/merdiven gibi öğeleri ekleyip plan
            üzerinde konumlandırın.
          </Typography>

          {rooms.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Bu binaya henüz oda eklenmemiş. Yine de giriş, merdiven gibi yapısal öğeleri
              işaretleyebilirsiniz.
            </Alert>
          )}

          <BuildingLayoutEditor
            buildingId={building.id!}
            rooms={rooms}
            initialLayout={building.layout_data}
          />
        </>
      )}
    </Container>
  );
}
