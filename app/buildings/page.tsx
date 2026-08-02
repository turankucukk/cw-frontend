// app/buildings/page.tsx
"use client";

import Navbar from "@/src/components/layout/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

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
    <Box sx={{ width: "100%", overflowX: "hidden", minHeight: "100vh", backgroundColor: "#f5f6f8" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          padding: { xs: "90px 16px 40px", md: "110px 40px 60px" },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

          <Box
            sx={{
              textAlign: "center",
              marginBottom: { xs: "32px", md: "48px" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "26px", md: "34px" },
                fontWeight: 700,
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              BİNALAR
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#6b7280",
                fontSize: { xs: "14px", md: "16px" },
              }}
            >
              Odalarını görmek istediğiniz binayı seçin.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: { xs: "20px", md: "28px" },
              width: "100%",
            }}
          >
            {buildings.map((building) => (
              <Link
                key={building.id}
                href={`/buildings/${building.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  width: "100%",
                }}
              >
                <Box
                  component="article"
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: { md: "translateY(-6px)" },
                      boxShadow: { md: "0 16px 32px rgba(0,0,0,0.1)" },
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: "220px", sm: "240px", md: "280px" },
                      backgroundColor: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid #f1f5f9",
                      position: "relative",
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {building.floor_plan_url ? (
                      <Box
                        component="img"
                        src={building.floor_plan_url}
                        alt={`${building.name} krokisi`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "20px",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: { md: "scale(1.03)" }
                          }
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          color: "#9ca3af",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontSize: { xs: "40px", md: "48px" },
                            marginBottom: "10px",
                          }}
                        >
                          🏢
                        </Box>

                        <Typography sx={{ margin: 0, fontSize: "16px" }}>
                          Kroki henüz eklenmemiş
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ padding: "20px" }}>
                    <Typography component="h2" sx={{ margin: 0, fontSize: "21px", fontWeight: 600, marginBottom: "10px" }}>
                      {building.name}
                    </Typography>

                    {building.location_url && (
                      <Box component="a"
                        href={building.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        sx={{ color: "#2563eb", fontSize: "14px", textDecoration: "none" }}
                      >
                        📍 Haritada Gör
                      </Box>
                    )}
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}