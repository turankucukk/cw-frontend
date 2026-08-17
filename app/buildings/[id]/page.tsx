"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import { Alert, Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListAltIcon from "@mui/icons-material/ListAlt";

import BuildingLayoutViewer from "@/src/components/rooms/BuildingLayoutViewer";
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

  const hasLayout = !!building?.layout_data?.floors?.some((f) => f.items.length > 0);

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
                  {hasLayout
                    ? "Görmek istediğiniz odaya tıklayın."
                    : "Bu bina için henüz kroki eklenmedi."}
                </Typography>
              </Box>

              {hasLayout ? (
                <BuildingLayoutViewer layout={building.layout_data} rooms={rooms} />
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Button
                    variant="contained"
                    startIcon={<ListAltIcon />}
                    onClick={() => router.push(`/rooms?buildingId=${building.id}`)}
                  >
                    Oda Listesini Görüntüle
                  </Button>
                </Box>
              )}

              {hasLayout && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Button
                    variant="text"
                    startIcon={<ListAltIcon />}
                    onClick={() => router.push(`/rooms?buildingId=${building.id}`)}
                  >
                    Bunun yerine liste olarak göster
                  </Button>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
