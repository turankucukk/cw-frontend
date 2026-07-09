import Navbar from "@/src/components/layout/Navbar";
import RoomCard from "@/src/components/rooms/RoomCard";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "CENTER", marginTop: "2rem" }}>
        <RoomCard />
      </div>
    </main>
  );
}