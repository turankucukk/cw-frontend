"use client";

import Navbarr from "@/src/components/layout/Navbar";
import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import Link from "next/link";

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

            const { data, error } = await supabase.from("building").select("id, name, floor_plan_url, location_url").order("id", { ascending: true });
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
            <Navbarr />

            <main
                style={{
                    padding: "110px 40px 40px",
                    minHeight: "100vh",
                    backgroundColor: "#f5f6f8",
                }}
            >
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "40px",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "32px",
                                marginBottom: "8px",
                            }}
                        >
                            BİNALAR
                        </h1>

                        <p
                            style={{
                                color: "#6b7280",
                            }}
                        >
                            Odalarını görmek istediğiniz binayı seçin.
                        </p>
                    </div>
                    
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "24px",
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
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-8px)";
                                        e.currentTarget.style.boxShadow = "0 19px 24px rgba(0,0,0,0.12)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "280px",
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
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    color: "#9ca3af",
                                                }}
                                            >
                                                <span
                                                style={{
                                                    fontSize: "48px",
                                                    marginBottom: "12px",
                                                }}
                                        >
                                            🏢
                                        </span>

                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "16px",
                                            }}
                                        >
                                            Kroki henüz eklenmemiş
                                        </p>
                                    </div>
                                )}
                            </div>
                                    <div style={{ padding: "20px" }}>
                                        <h2
                                            style={{
                                                margin: 0,
                                                fontSize: "21px",
                                                fontWeight: 600,
                                                marginBottom: "10px",
                                            }}
                                        >
                                            {building.name}
                                        </h2>
                                        {building.location_url && (
                                            <a>
                                                href={building.location_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    color: "#2563eb",
                                                    fontSize: "14px",
                                                    textDecoration: "none",
                                                }} 
                                            
                                                📍 Haritada Gör
                                            </a>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}