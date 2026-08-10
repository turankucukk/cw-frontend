// app/buildings/page.tsx
"use client";

import Navbar from "@/src/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Typography,
  Container,
  Link as MuiLink,
} from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import Footer from "@/src/components/layout/Footer";

type Building = {
  id: number;
  name: string;
  floor_plan_url: string | null;
  location_url: string | null;
};

export default function BuildingsPage() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("building")
        .select("id, name, floor_plan_url, location_url")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching buildings:", error);
      } else {
        setBuildings(data ?? []);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <>
      <Navbar />

      <Box
        component="main"
        sx={{
          pt: "110px",
          px: 5,
          pb: 5,
          minHeight: "100vh",
          backgroundColor: "#f5f6f8",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              mb: 5,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 1,
                fontWeight: 600,
              }}
            >
              BİNALAR
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#6b7280",
              }}
            >
              Odalarını görmek istediğiniz binayı seçin.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {buildings.map((building) => (
              <Grid size={{ xs: 12, sm: 6 }} key={building.id}>
                <Card
                  onClick={() => router.push(`/rooms?buildingId=${building.id}`)}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 19px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 280,
                      bgcolor: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {building.floor_plan_url ? (
                      <Box
                        component="img"
                        src={building.floor_plan_url}
                        alt={`${building.name} krokisi`}
                        sx={{ width: "100%", height: "100%", objectFit: "contain", p: 2 }}
                      />
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#9ca3af" }}>
                        <ApartmentRoundedIcon sx={{ fontSize: 48, mb: 1.5 }} />
                        <Typography>Kroki henüz eklenmemiş</Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {building.name}
                    </Typography>

                    {building.location_url && (
                      <MuiLink
                        href={building.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontSize: 14,
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <PlaceRoundedIcon sx={{ fontSize: 16 }} />
                        Haritada Gör
                      </MuiLink>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
