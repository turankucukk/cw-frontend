"use client";

import Navbarr from "@/src/components/layout/Navbar";
import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";

type Building = {
    id: number;
    name: string;
    floor_plan_url: string | null;
    location_url: string | null;
};

export default function BuildingsPage() {
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
        <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f5f6f8" }}>
            <Navbarr />

            <Box
                component="main"
                sx={{
                    pt: { xs: "96px", sm: "110px" },
                    pb: { xs: 4, sm: 6 },
                    px: { xs: 2, sm: 4 },
                }}
            >
                <Container maxWidth="lg" disableGutters>
                    {/* BAŞLIK ALANI */}
                    <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 5 } }}>
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                fontSize: { xs: "24px", sm: "32px" }, 
                                fontWeight: 700, 
                                mb: 1, 
                                color: "#111827" 
                            }}
                        >
                            BİNALAR
                        </Typography>

                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: "#6b7280", 
                                fontSize: { xs: "14px", sm: "16px" } 
                            }}
                        >
                            Odalarını görmek istediğiniz binayı seçin.
                        </Typography>
                    </Box>
                    
                    {/* BİNA KARTLARI GRID ALANI */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, // Mobilde 1 kolon, PC'de 2 kolon
                            gap: { xs: 2.5, sm: 3 },
                        }}
                    >
                        {buildings.map((building) => (
                            <Link
                                key={building.id}
                                href={`/buildings/${building.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <article
                                    style={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                        transition: "all 0.3s ease",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-6px)";
                                        e.currentTarget.style.boxShadow = "0 16px 24px rgba(0,0,0,0.12)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                                    }}
                                >
                                    {/* Kroki / Görsel Alanı */}
                                    <Box
                                        sx={{
                                            height: { xs: "200px", sm: "260px", md: "280px" },
                                            backgroundColor: "#f9fafb",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {building.floor_plan_url ? (
                                            <img
                                                src={building.floor_plan_url}
                                                alt={`${building.name} krokisi`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    padding: "16px",
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
                                                <span
                                                    style={{
                                                        fontSize: "40px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    🏢
                                                </span>

                                                <Typography
                                                    sx={{
                                                        fontSize: { xs: "14px", sm: "16px" },
                                                        color: "#9ca3af",
                                                    }}
                                                >
                                                    Kroki henüz eklenmemiş
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Kart Bilgi Alanı */}
                                    <Box sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1 }}>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontSize: { xs: "18px", sm: "21px" },
                                                fontWeight: 600,
                                                mb: 1,
                                                color: "#111827",
                                            }}
                                        >
                                            {building.name}
                                        </Typography>

                                        {building.location_url && (
                                            <a
                                                href={building.location_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    color: "#2563eb",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    textDecoration: "none",
                                                    display: "inline-block",
                                                }}
                                            >
                                                📍 Haritada Gör
                                            </a>
                                        )}
                                    </Box>
                                </article>
                            </Link>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}