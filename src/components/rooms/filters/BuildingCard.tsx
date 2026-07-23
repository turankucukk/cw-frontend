"use client";

import Navbar from "@/src/components/layout/Navbar";
import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import Link from "next/link";
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Typography,
    Container,
} from "@mui/material";

type Building = {
    id: number;
    name: string;
    floor_plan_url: string | null;
};

export default function BuildingsPage() {
    const [buildings, setBuildings] = useState<Building[]>([]);

    useEffect(() => {
        const fetchBuildings = async () => {
            const supabase = createClient();

            const { data, error } = await supabase.from("building").select("id, name, floor_plan_url").order("id", { ascending: true });
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
                            <Grid  size={{ xs: 12, sm: 6 }} key={building.id}>
                                <Link
                                    href={`/buildings/${building.id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <Card
                                        sx={{
                                            height: "100%",
                                            cursor: "pointer",
                                            transition: "box-shadow 0.3s ease",
                                            "&:hover": {
                                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                height: 280,
                                                backgroundColor: "#f9fafb",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                p: 2,
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
                                                    }}
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#9ca3af",
                                                    }}
                                                >
                                                    Kroki henüz eklenmemiş
                                                </Typography>
                                            )}
                                        </CardMedia>

                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                sx={{
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {building.name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
}