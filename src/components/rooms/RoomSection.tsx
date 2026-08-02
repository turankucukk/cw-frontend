// src/components/rooms/RoomSection.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { Box } from "@mui/material";
import RoomList from "./RoomList";
import BuildingFloorPlan from "@/src/components/rooms/BuildingFloorPlan";
import GlassCard from "@/src/components/layout/GlassCard";
import Navbar from "../layout/Navbar";
import FilterBar from "./FilterBar";
import Footer from "../layout/Footer";
import { getBuildings, type Building } from "@/src/lib/api/building";
import { getRooms, type Room } from "@/src/lib/api/rooms";
import { useSearchParams } from "next/navigation";

function RoomsContent() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    Promise.all([getBuildings(), getRooms()])
      .then(([buildingsData, roomsData]) => {
        setBuildings(buildingsData);
        setRooms(roomsData);
      })
      .catch((err) => {
        console.error("Veriler yüklenirken hata:", err);
        setError("Odalar yüklenirken bir hata oluştu.");
      });
  }, []);

  useEffect(() => {
    const buildingIdFromUrl = searchParams.get("buildingId");
    if (buildingIdFromUrl) {
      setSelectedBuildingId(Number(buildingIdFromUrl));
    }
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <Box sx={{ px: { xs: 2, md: 8 }, mt: { xs: 10, md: 12 }, pb: 4 }}>
        
        {/* 1. Kroki En Üstte */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <GlassCard sx={{ width: "100%" }}>
            <BuildingFloorPlan />
          </GlassCard>
        </Box>

        {/* 2. Filtreleme Çubuğu */}
        <GlassCard sx={{ mb: 4 }}>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            buildings={buildings}
            selectedBuildingId={selectedBuildingId}
            onBuildingChange={setSelectedBuildingId}
            minCapacity={minCapacity}
            onCapacityChange={setMinCapacity}
            selectedFeatures={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
          />
        </GlassCard>

        {/* 3. Oda Listesi */}
        <GlassCard>
          <RoomList
            rooms={rooms}
            search={search}
            selectedBuildingId={selectedBuildingId}
            minCapacity={minCapacity}
            selectedFeatures={selectedFeatures}
            error={error}
          />
        </GlassCard>

      </Box>
      <Footer />
    </>
  );
}

export default function RoomSection() {
  return (
    <Suspense fallback={null}>
      <RoomsContent />
    </Suspense>
  );
}